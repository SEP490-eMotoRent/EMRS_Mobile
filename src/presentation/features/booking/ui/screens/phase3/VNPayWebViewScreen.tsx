import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { container } from '../../../../../../core/di/ServiceContainer';
import { BookingStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useBookingStatusPolling } from '../../../hooks/useBookingStatusPolling';
import { PageHeader } from '../../molecules/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

type RoutePropType = any;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'VNPayWebView'>;

interface BookingContext {
    bookingId: string;
    vehicleId: string;
    vehicleName: string;
    vehicleImageUrl?: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
    branchName: string;
    insurancePlan: string;
    totalAmount: string;
    securityDeposit: string;
}

export const VNPayWebViewScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const webviewRef = useRef<WebView>(null);

    const {
        vnpayUrl,
        bookingId,
        expiresAt,
        vehicleName,
        totalAmount,
        vehicleId,
        vehicleImageUrl,
        startDate,
        endDate,
        duration,
        rentalDays,
        branchName,
        insurancePlan,
        securityDeposit,
    } = route.params;

    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [pollingEnabled, setPollingEnabled] = useState(true);
    const expiryTimer = useRef<NodeJS.Timeout | null>(null);
    const hasHandled = useRef(false);

    const STORAGE_KEY = `vnpay_payment_context_${bookingId}`;

    // ==================== STATUS POLLING ====================
    useBookingStatusPolling({
        bookingId,
        enabled: pollingEnabled && !hasHandled.current,
        onStatusChange: (status) => {
            console.log('═══════════════════════════════════════════════════');
            console.log('🔔 [VNPAY POLLING] Status change detected:', status);
            console.log('═══════════════════════════════════════════════════');
            
            if (status === 'Booked') {
                console.log('✅ [VNPAY POLLING] Payment confirmed via polling!');
                console.log('🎯 [VNPAY POLLING] Deep link may have failed, but polling caught it');
                
                hasHandled.current = true;
                setPollingEnabled(false);
                
                Alert.alert(
                    'Thanh toán thành công!',
                    'Thanh toán của bạn đã được xác nhận',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigateToContract()
                        }
                    ]
                );
            } else if (status === 'Cancelled') {
                console.log('❌ [VNPAY POLLING] Booking cancelled');
                hasHandled.current = true;
                setPollingEnabled(false);
                showFailure('Booking đã hết hạn. Nếu bạn đã thanh toán, vui lòng liên hệ hỗ trợ với mã booking: ' + bookingId);
            }
        },
        pollingInterval: 3000,
        maxDuration: 15 * 60 * 1000,
    });

    // Store context
    useEffect(() => {
        const ctx: BookingContext = {
            bookingId,
            vehicleId,
            vehicleName,
            vehicleImageUrl,
            startDate,
            endDate,
            duration,
            rentalDays,
            branchName,
            insurancePlan,
            totalAmount,
            securityDeposit,
        };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ctx)).catch(console.error);

        return () => {
            if (!hasHandled.current) {
                AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
            }
        };
    }, []);

    // Navigate to contract screen
    const navigateToContract = useCallback(async () => {
        const ctxStr = await AsyncStorage.getItem(STORAGE_KEY);
        const ctx: BookingContext | null = ctxStr ? JSON.parse(ctxStr) : null;

        navigation.replace('DigitalContract', {
            vehicleId: ctx?.vehicleId || vehicleId,
            vehicleName: ctx?.vehicleName || vehicleName,
            vehicleImageUrl: ctx?.vehicleImageUrl || vehicleImageUrl || '',
            startDate: ctx?.startDate || startDate,
            endDate: ctx?.endDate || endDate,
            duration: ctx?.duration || duration,
            rentalDays: ctx?.rentalDays || rentalDays,
            branchName: ctx?.branchName || branchName,
            insurancePlan: ctx?.insurancePlan || insurancePlan,
            totalAmount: ctx?.totalAmount || totalAmount,
            securityDeposit: ctx?.securityDeposit || securityDeposit,
            contractNumber: bookingId,
        });

        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }, [navigation, STORAGE_KEY, bookingId, vehicleId, vehicleName, vehicleImageUrl, startDate, endDate, duration, rentalDays, branchName, insurancePlan, totalAmount, securityDeposit]);

    // Parse VNPay callback from URL
    const buildDtoFromUrl = (url: string) => {
        try {
            const u = new URL(url);
            const p = u.searchParams;

            const vnp_ResponseCode = p.get("vnp_ResponseCode");
            const vnp_TxnRef = p.get("vnp_TxnRef");
            const vnp_Amount = p.get("vnp_Amount");
            const vnp_BankCode = p.get("vnp_BankCode");
            const vnp_BankTranNo = p.get("vnp_BankTranNo");
            const vnp_CardType = p.get("vnp_CardType");
            const vnp_PayDate = p.get("vnp_PayDate");
            const vnp_TransactionNo = p.get("vnp_TransactionNo");

            if (!vnp_ResponseCode || !vnp_TxnRef) return null;

            const amount = vnp_Amount ? parseInt(vnp_Amount) / 100 : 0;
            const formatDate = (d: string) =>
                `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}T${d.slice(8,10)}:${d.slice(10,12)}:${d.slice(12,14)}+07:00`;

            return {
                isSuccess: vnp_ResponseCode === "00",
                orderId: vnp_TxnRef,
                transactionId: vnp_TransactionNo || "",
                amount,
                responseCode: vnp_ResponseCode,
                message: vnp_ResponseCode === "00" ? "Payment success" : "Payment failed",
                bankCode: vnp_BankCode || "",
                bankTransactionNo: vnp_BankTranNo || "",
                cardType: vnp_CardType || "",
                transactionDate: vnp_PayDate ? formatDate(vnp_PayDate) : new Date().toISOString(),
            };
        } catch (e) {
            console.error("❌ Failed to parse VNPay URL:", e);
            return null;
        }
    };

    // Handle deep link callback
    const handleDeepLink = useCallback(
        async (url: string) => {
            if (hasHandled.current) {
                console.log('⚠️ Deep link already handled, ignoring:', url);
                return;
            }

            console.log('═══════════════════════════════════════════════════');
            console.log('🔗 [DEEP LINK] Processing callback');
            console.log('═══════════════════════════════════════════════════');
            console.log('📥 URL:', url);

            hasHandled.current = true;
            setPollingEnabled(false); // Stop polling when deep link fires

            webviewRef.current?.stopLoading();
            setLoading(true);

            const dto = buildDtoFromUrl(url);

            if (!dto) {
                console.error('❌ Invalid deep link format');
                showFailure("Lỗi xử lý thanh toán");
                return;
            }

            console.log('📦 VNPay callback data:', dto);

            if (dto.responseCode !== '00') {
                console.error('❌ Payment failed:', dto.message);
                showFailure(dto.message || "Thanh toán thất bại");
                return;
            }

            console.log('✅ Payment successful, confirming with backend...');

            try {
                await container.booking.payment.confirmVNPay.execute(dto);
                console.log('✅ Backend confirmed payment successfully');

                await new Promise(resolve => setTimeout(resolve, 1500));
                await navigateToContract();

            } catch (error: any) {
                console.error('❌ Callback API failed:', error);

                Alert.alert(
                    'Lỗi xác nhận',
                    'Thanh toán thành công nhưng không thể xác nhận với hệ thống. Vui lòng kiểm tra mục "Chuyến đi" sau vài phút.',
                    [
                        {
                            text: 'Thử lại',
                            onPress: () => {
                                hasHandled.current = false;
                                setPollingEnabled(true);
                                handleDeepLink(url);
                            }
                        },
                        {
                            text: 'Đóng',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        },
        [navigateToContract, navigation]
    );

    // Listen for deep links globally
    useEffect(() => {
        const handleDeepLinkEvent = (event: { url: string }) => {
            console.log('🔗 Deep link event received:', event.url);
            if (event.url.startsWith('emrs://payment/callback')) {
                console.log('🎯 VNPay callback detected!');
                handleDeepLink(event.url);
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

        Linking.getInitialURL().then(url => {
            if (url && url.startsWith('emrs://payment/callback')) {
                console.log('🎯 App opened with VNPay callback:', url);
                handleDeepLink(url);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [handleDeepLink]);

    // Timer
    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
            setTimeLeft(diff);
            if (diff <= 0 && !hasHandled.current) {
                hasHandled.current = true;
                setPollingEnabled(false);
                showExpiry();
            }
        };
        tick();
        expiryTimer.current = setInterval(tick, 1000);

        return () => {
            if (expiryTimer.current) clearInterval(expiryTimer.current);
        };
    }, [expiresAt]);

    // Block deep link navigation in WebView
    const onShouldStartLoadWithRequest = useCallback(
        (request: any): boolean => {
            const url = request.url || '';
            console.log('🚦 WebView wants to load:', url);
            
            if (url.startsWith('emrs://')) {
                console.log('🛑 Blocking WebView from loading deep link');
                console.log('✅ Deep link will be handled by Linking API');
                return false;
            }

            return true;
        },
        []
    );

    const showFailure = (msg: string = 'Thanh toán thất bại') => {
        Alert.alert('Thất bại', msg, [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    const showExpiry = () => {
        Alert.alert('Hết hạn', 'Phiên thanh toán đã hết.', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('ConfirmRentalDuration' as never),
            },
        ]);
    };

    const handleBack = () => {
        if (hasHandled.current) {
            navigation.goBack();
            return;
        }
        Alert.alert('Hủy thanh toán?', 'Bạn có chắc muốn rời khỏi trang thanh toán?', [
            { text: 'Tiếp tục thanh toán', style: 'cancel' },
            {
                text: 'Hủy',
                style: 'destructive',
                onPress: () => {
                    setPollingEnabled(false);
                    navigation.goBack();
                },
            },
        ]);
    };

    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Thanh toán VNPay" onBack={handleBack} />

            {timeLeft > 0 && (
                <View style={styles.timer}>
                    <Text style={styles.timerTxt}>Còn: {formatTime(timeLeft)}</Text>
                </View>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Thông tin thanh toán</Text>
                <View style={styles.row}>
                    <Text style={styles.lbl}>Xe:</Text>
                    <Text style={styles.val}>{vehicleName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.lbl}>Số tiền:</Text>
                    <Text style={styles.val}>{totalAmount}</Text>
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
                    Sau khi thanh toán, ứng dụng sẽ tự động quay lại
                </Text>
            </View>
        </SafeAreaView>
    );
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
    val: { color: '#fff', fontSize: 14, fontWeight: '600' },
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