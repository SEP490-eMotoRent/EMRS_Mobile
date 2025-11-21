import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import sl from '../../../../../../core/di/InjectionContainer';
import { ProcessTopUpCallbackUseCase } from '../../../../../../domain/usecases/wallet/topUp/ProcessTopUpCallbackUseCase';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { PageHeader } from '../../../../booking/ui/molecules/PageHeader';


type RoutePropType = RouteProp<ProfileStackParamList, 'WalletVNPayWebView'>;
type NavigationProp = StackNavigationProp<ProfileStackParamList, 'WalletVNPayWebView'>;

interface WalletContext {
    transactionId: string;
    amount: number;
    transactionCode: string;
}

export const WalletVNPayWebViewScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationProp>();
    const webviewRef = useRef<WebView>(null);

    const { vnpayUrl, transactionId, amount, expiresAt } = route.params;

    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const expiryTimer = useRef<NodeJS.Timeout | null>(null);
    const hasHandled = useRef(false);

    const processTopUpCallback = useMemo(
        () => sl.get<ProcessTopUpCallbackUseCase>('ProcessTopUpCallbackUseCase'),
        []
    );

    const STORAGE_KEY = `vnpay_wallet_context_${transactionId}`;

    // Parse VNPay callback from URL
    const buildDtoFromUrl = (url: string) => {
        try {
            const u = new URL(url);
            const p = u.searchParams;

            const vnp_ResponseCode = p.get('vnp_ResponseCode');
            const vnp_TxnRef = p.get('vnp_TxnRef');
            const vnp_Amount = p.get('vnp_Amount');
            const vnp_BankCode = p.get('vnp_BankCode');
            const vnp_BankTranNo = p.get('vnp_BankTranNo');
            const vnp_CardType = p.get('vnp_CardType');
            const vnp_PayDate = p.get('vnp_PayDate');
            const vnp_TransactionNo = p.get('vnp_TransactionNo');

            if (!vnp_ResponseCode || !vnp_TxnRef) return null;

            const parsedAmount = vnp_Amount ? parseInt(vnp_Amount) / 100 : 0;
            const formatDate = (d: string) =>
                `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(8, 10)}:${d.slice(10, 12)}:${d.slice(12, 14)}+07:00`;

            return {
                isSuccess: vnp_ResponseCode === '00',
                orderId: vnp_TxnRef,
                transactionId: vnp_TransactionNo || '',
                amount: parsedAmount,
                responseCode: vnp_ResponseCode,
                message: vnp_ResponseCode === '00' ? 'Payment success' : 'Payment failed',
                bankCode: vnp_BankCode || '',
                bankTransactionNo: vnp_BankTranNo || '',
                cardType: vnp_CardType || '',
                transactionDate: vnp_PayDate ? formatDate(vnp_PayDate) : new Date().toISOString(),
            };
        } catch (e) {
            console.error('❌ Failed to parse VNPay URL:', e);
            return null;
        }
    };

    // Navigate to result screen
    const navigateToResult = useCallback(
        async (success: boolean, errorMessage?: string) => {
            await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});

            navigation.replace('WalletTopUpResult', {
                success,
                amount,
                transactionId: success ? transactionId : undefined,
                errorMessage,
            });
        },
        [navigation, STORAGE_KEY, amount, transactionId]
    );

    // Handle deep link callback
    const handleDeepLink = useCallback(
        async (url: string) => {
            if (hasHandled.current) {
                console.log('⚠️ Deep link already handled');
                return;
            }

            console.log('🔗 Processing wallet deep link:', url);
            hasHandled.current = true;

            webviewRef.current?.stopLoading();
            setLoading(true);

            const dto = buildDtoFromUrl(url);

            if (!dto) {
                console.error('❌ Invalid deep link format');
                await navigateToResult(false, 'Lỗi xử lý thanh toán');
                return;
            }

            console.log('📦 VNPay callback data:', dto);

            if (dto.responseCode !== '00') {
                console.error('❌ Payment failed:', dto.message);
                await navigateToResult(false, getVNPayErrorMessage(dto.responseCode));
                return;
            }

            console.log('✅ Payment successful, confirming with backend...');

            try {
                await processTopUpCallback.execute(dto);
                console.log('✅ Backend confirmed top-up successfully');

                await new Promise((resolve) => setTimeout(resolve, 1000));
                await navigateToResult(true);
            } catch (error: any) {
                console.error('❌ Callback API failed:', error);

                Alert.alert(
                    'Lỗi xác nhận',
                    'Thanh toán thành công nhưng không thể xác nhận với hệ thống. Vui lòng kiểm tra số dư ví sau vài phút.',
                    [
                        {
                            text: 'Thử lại',
                            onPress: () => {
                                hasHandled.current = false;
                                handleDeepLink(url);
                            },
                        },
                        {
                            text: 'Đóng',
                            onPress: () => navigateToResult(false, 'Không thể xác nhận thanh toán'),
                        },
                    ]
                );
            }
        },
        [processTopUpCallback, navigateToResult]
    );

    // Listen for deep links
    useEffect(() => {
        const handleDeepLinkEvent = (event: { url: string }) => {
            console.log('🔗 Deep link event:', event.url);
            if (event.url.startsWith('emrs://payment/callback')) {
                handleDeepLink(event.url);
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

        Linking.getInitialURL().then((url) => {
            if (url && url.startsWith('emrs://payment/callback')) {
                handleDeepLink(url);
            }
        });

        return () => subscription.remove();
    }, [handleDeepLink]);

    // Timer
    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
            setTimeLeft(diff);
            if (diff <= 0 && !hasHandled.current) {
                hasHandled.current = true;
                showExpiry();
            }
        };
        tick();
        expiryTimer.current = setInterval(tick, 1000);

        return () => {
            if (expiryTimer.current) clearInterval(expiryTimer.current);
        };
    }, [expiresAt]);

    const onShouldStartLoadWithRequest = useCallback((request: any): boolean => {
        const url = request.url || '';
        console.log('🚦 WebView wants to load:', url);

        if (url.startsWith('emrs://')) {
            console.log('🛑 Blocking WebView from loading deep link');
            return false;
        }

        return true;
    }, []);

    const showExpiry = () => {
        Alert.alert('Hết hạn', 'Phiên thanh toán đã hết hạn.', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    const handleBack = () => {
        if (hasHandled.current) {
            navigation.goBack();
            return;
        }
        Alert.alert('Hủy thanh toán?', 'Bạn có chắc muốn hủy nạp tiền?', [
            { text: 'Tiếp tục thanh toán', style: 'cancel' },
            { text: 'Hủy', style: 'destructive', onPress: () => navigation.goBack() },
        ]);
    };

    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (value: number): string => {
        return `${value.toLocaleString('vi-VN')}đ`;
    };

    return (
        <View style={styles.container}>
            <PageHeader title="Thanh toán VNPay" onBack={handleBack} />

            {timeLeft > 0 && (
                <View style={styles.timer}>
                    <Text style={styles.timerTxt}>Còn: {formatTime(timeLeft)}</Text>
                </View>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Nạp tiền vào ví</Text>
                <View style={styles.row}>
                    <Text style={styles.lbl}>Số tiền:</Text>
                    <Text style={styles.val}>{formatCurrency(amount)}</Text>
                </View>
            </View>

            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.overlayTxt}>Đang tải trang thanh toán...</Text>
                </View>
            )}

            <WebView
                ref={webviewRef}
                source={{ uri: vnpayUrl }}
                style={styles.webview}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                javaScriptEnabled
                domStorageEnabled
                cacheEnabled={false}
                thirdPartyCookiesEnabled
                sharedCookiesEnabled
            />

            <View style={styles.footer}>
                <Text style={styles.footerTxt}>
                    Sau khi thanh toán, ứng dụng sẽ tự động cập nhật số dư
                </Text>
            </View>
        </View>
    );
};

const getVNPayErrorMessage = (code: string): string => {
    const map: Record<string, string> = {
        '07': 'Giao dịch bị nghi ngờ gian lận',
        '09': 'Thẻ chưa đăng ký dịch vụ thanh toán online',
        '13': 'Sai OTP',
        '24': 'Khách hàng hủy giao dịch',
        '51': 'Tài khoản không đủ số dư',
        '99': 'Lỗi không xác định',
    };
    return map[code] || `Thanh toán thất bại (Mã: ${code})`;
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    timer: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    timerTxt: { color: '#fbbf24', fontSize: 16, fontWeight: '600' },
    infoCard: {
        backgroundColor: '#1a1a1a',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
    },
    infoTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    lbl: { color: '#999', fontSize: 14 },
    val: { color: '#c4b5fd', fontSize: 16, fontWeight: '700' },
    webview: { flex: 1, marginTop: 16 },
    overlay: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
        marginTop: -40,
    },
    overlayTxt: { color: '#fff', fontSize: 16, marginTop: 12 },
    footer: {
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    footerTxt: { color: '#999', fontSize: 14, textAlign: 'center' },
});