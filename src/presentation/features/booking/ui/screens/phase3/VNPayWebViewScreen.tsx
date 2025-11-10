import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import sl from '../../../../../../core/di/InjectionContainer';
import { ConfirmVNPayPaymentUseCase } from '../../../../../../domain/usecases/booking/ConfirmVNPayPaymentUseCase';
import { BookingStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useBookingStatus } from '../../../hooks/useBookingStatus';
import { PageHeader } from '../../molecules/PageHeader';
import { VNPayCallback } from '../../../../../../data/models/booking/vnpay/VNPayCallback';

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
    const [apiLoading, setApiLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const expiryTimer = useRef<NodeJS.Timeout | null>(null);
    const hasHandled = useRef(false);

    const confirmVNPayPayment = useMemo(
        () => sl.get<ConfirmVNPayPaymentUseCase>("ConfirmVNPayPaymentUseCase"),
        []
    );

    const STORAGE_KEY = `vnpay_payment_context_${bookingId}`;

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
    }, [
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
    ]);

    const { stopPolling } = useBookingStatus({
        bookingId,
        pollingInterval: 3000,
        onStatusChange: (status) => {
            if (hasHandled.current) return;
            if (status === 'Booked') {
                hasHandled.current = true;
                stopPolling();
                navigateToContract();
            }
            if (status === 'Cancelled') {
                hasHandled.current = true;
                stopPolling();
                showFailure('Đơn hàng đã bị hủy');
            }
        },
        enabled: !hasHandled.current,
    });

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (!hasHandled.current) {
                    hasHandled.current = true;
                    stopPolling();
                }
            };
        }, [stopPolling])
    );

    useEffect(() => {
        const tick = () => {
            const diff = Math.max(
                0,
                Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
            );
            setTimeLeft(diff);
            if (diff <= 0 && !hasHandled.current) {
                hasHandled.current = true;
                stopPolling();
                showExpiry();
            }
        };
        tick();
        expiryTimer.current = setInterval(tick, 1000);

        return () => {
            if (expiryTimer.current) clearInterval(expiryTimer.current);
            stopPolling();
        };
    }, [expiresAt, stopPolling]);

    const buildDtoFromUrl = (url: string): VNPayCallback | null => {
        try {
            const u = new URL(url);
            const p = u.searchParams;

            const vnp_Amount = p.get("vnp_Amount");
            const vnp_BankCode = p.get("vnp_BankCode");
            const vnp_BankTranNo = p.get("vnp_BankTranNo");
            const vnp_CardType = p.get("vnp_CardType");
            const vnp_PayDate = p.get("vnp_PayDate");
            const vnp_ResponseCode = p.get("vnp_ResponseCode");
            const vnp_TransactionNo = p.get("vnp_TransactionNo");
            const vnp_TxnRef = p.get("vnp_TxnRef");

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
        } catch {
            return null;
        }
    };

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

        // Clean up
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }, [
        navigation,
        STORAGE_KEY,
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
        bookingId,
    ]);

    const handleDeepLink = useCallback(
        async (url: string) => {
            if (hasHandled.current) return;
            hasHandled.current = true;
            stopPolling();
            webviewRef.current?.stopLoading();

            // Clear WebView
            webviewRef.current?.injectJavaScript(`
                document.body.innerHTML = '<div style="background:#000;color:#fff;text-align:center;padding:50px;font-size:18px;">Đang chuyển về ứng dụng...</div>';
            `);

            const dto = buildDtoFromUrl(url);
            if (!dto || dto.responseCode !== '00') {
                showFailure("Thanh toán thất bại");
                return;
            }

            // NO CONFIRM API
            // IPN already did it
            await navigateToContract();
        },
        [stopPolling, navigateToContract]
    );
    const INJECTED_JS = `
      (function() {
        const origHref = Object.getOwnPropertyDescriptor(window.location, 'href');
        const origAssign = window.location.assign;
        const origReplace = window.location.replace;
        const origOpen = window.open;

        const postDeepLink = (url) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEEP_LINK', url }));
        };

        Object.defineProperty(window.location, 'href', {
          set: function(url) {
            if (url && url.startsWith('emrs://')) {
              postDeepLink(url);
              return;
            }
            if (origHref) origHref.set.call(this, url);
          },
          get: origHref ? origHref.get : () => window.location.href
        });

        window.location.assign = function(url) {
          if (url && typeof url === 'string' && url.startsWith('emrs://')) {
            postDeepLink(url);
            return;
          }
          origAssign.call(this, url);
        };

        window.location.replace = function(url) {
          if (url && typeof url === 'string' && url.startsWith('emrs://')) {
            postDeepLink(url);
            return;
          }
          origReplace.call(this, url);
        };

        window.open = function(url) {
          if (url && typeof url === 'string' && url.startsWith('emrs://')) {
            postDeepLink(url);
            return null;
          }
          return origOpen.apply(this, arguments);
        };

        document.addEventListener('click', function(e) {
          const a = e.target.closest('a');
          if (a && a.href && a.href.startsWith('emrs://')) {
            e.preventDefault();
            postDeepLink(a.href);
          }
        }, true);

        document.addEventListener('submit', function(e) {
          const form = e.target;
          if (form && form.action && form.action.startsWith('emrs://')) {
            e.preventDefault();
            postDeepLink(form.action);
          }
        }, true);

        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) {
                const links = (node as Element).querySelectorAll ? 
                  (node as Element).querySelectorAll('a[href^="emrs://"]') : [];
                links.forEach(a => {
                  a.addEventListener('click', (e) => {
                    e.preventDefault();
                    postDeepLink(a.href);
                  });
                });
              }
            });
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        true;
      })();
    `;

    const onMessage = useCallback(
        (event: WebViewMessageEvent) => {
            try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'DEEP_LINK' && data.url) {
                    handleDeepLink(data.url);
                }
            } catch (e) {}
        },
        [handleDeepLink]
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
        if (hasHandled.current || apiLoading) {
            navigation.goBack();
            return;
        }
        Alert.alert('Hủy thanh toán?', 'Bạn có chắc muốn rời khỏi trang thanh toán?', [
            { text: 'Tiếp tục thanh toán', style: 'cancel' },
            {
                text: 'Hủy',
                style: 'destructive',
                onPress: () => {
                    stopPolling();
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
        <View style={styles.container}>
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

            {(loading || apiLoading) && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.overlayTxt}>
                        {apiLoading ? 'Đang xác nhận thanh toán...' : 'Đang tải trang thanh toán...'}
                    </Text>
                </View>
            )}

            <WebView
                ref={webviewRef}
                source={{ uri: vnpayUrl }}
                style={styles.webview}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onMessage={onMessage}
                injectedJavaScript={INJECTED_JS}
                javaScriptEnabled
                domStorageEnabled
                cacheEnabled={false}
                thirdPartyCookiesEnabled
                sharedCookiesEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
            />

            <View style={styles.footer}>
                <Text style={styles.footerTxt}>
                    Sau khi thanh toán, ứng dụng sẽ tự động quay lại
                </Text>
            </View>
        </View>
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