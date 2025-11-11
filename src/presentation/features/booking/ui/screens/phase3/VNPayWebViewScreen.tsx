import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import sl from '../../../../../../core/di/InjectionContainer';
import { ConfirmVNPayPaymentUseCase } from '../../../../../../domain/usecases/booking/ConfirmVNPayPaymentUseCase';
import { BookingStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useBookingStatus } from '../../../hooks/useBookingStatus';
import { PageHeader } from '../../molecules/PageHeader';

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
        bookingCode,
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
    const expiryTimer = useRef<NodeJS.Timeout | null>(null);
    const hasHandled = useRef(false);

    const confirmVNPayPayment = useMemo(
        () => sl.get<ConfirmVNPayPaymentUseCase>("ConfirmVNPayPaymentUseCase"),
        []
    );

    const STORAGE_KEY = `vnpay_payment_context_${bookingId}`;

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
    }, [bookingId, vehicleId, vehicleName, vehicleImageUrl, startDate, endDate, duration, rentalDays, branchName, insurancePlan, totalAmount, securityDeposit]);

    const { stopPolling } = useBookingStatus({
        bookingId,
        pollingInterval: 3000,
        onStatusChange: (status) => {
            console.log(`📊 Polling detected status: ${status}`);
        },
        enabled: false,
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
    }, [navigation, STORAGE_KEY, vehicleId, vehicleName, vehicleImageUrl, startDate, endDate, duration, rentalDays, branchName, insurancePlan, totalAmount, securityDeposit, bookingId]);


    // Handle deep link callback
    const handleDeepLink = useCallback(
        async (url: string) => {
            if (hasHandled.current) {
                console.log('⚠️ Deep link already handled, ignoring:', url);
                return;
            }

            console.log('🔗 Processing deep link:', url);

            hasHandled.current = true;
            stopPolling();

            // Stop WebView from showing error page
            webviewRef.current?.stopLoading();
            setLoading(true);

            const dto = buildDtoFromUrl(url);

            if (!dto) {
                console.error('❌ Invalid deep link format');
                showFailure("Lỗi xử lý thanh toán");
                return;
            }

            console.log('📦 VNPay callback data:', dto);

            // Validate booking code matches
            if (bookingCode && dto.orderId !== bookingCode) {
                console.error('❌ Booking code mismatch:', {
                    expected: bookingCode,
                    received: dto.orderId
                });
                showFailure("Mã đơn hàng không khớp");
                return;
            }

            // Payment failed
            if (dto.responseCode !== '00') {
                console.error('❌ Payment failed:', dto.message);
                showFailure(dto.message || "Thanh toán thất bại");
                return;
            }

            // ✅ Payment successful
            console.log('✅ Payment successful, confirming with backend...');
            console.log('📤 Sending callback data:', JSON.stringify(dto, null, 2));

            try {
                // Call callback API to confirm payment
                await confirmVNPayPayment.execute(dto);
                console.log('✅ Backend confirmed payment successfully');

                // Wait a bit for backend to process
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Navigate to contract
                await navigateToContract();

            } catch (error: any) {
                console.error('❌ Callback API failed:', error);
                console.error('❌ Error details:', JSON.stringify(error.response?.data, null, 2));

                // Show error with retry option
                Alert.alert(
                    'Lỗi xác nhận',
                    'Thanh toán thành công nhưng không thể xác nhận với hệ thống. Vui lòng kiểm tra mục "Chuyến đi" sau vài phút.',
                    [
                        {
                            text: 'Thử lại',
                            onPress: () => {
                                hasHandled.current = false;
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
        [stopPolling, confirmVNPayPayment, navigateToContract, navigation, bookingCode]
    );
    // ✅ CRITICAL: Listen for deep links globally
    useEffect(() => {
        const handleDeepLinkEvent = (event: { url: string }) => {
            console.log('🔗 Deep link event received:', event.url);
            if (event.url.startsWith('emrs://payment/callback')) {
                console.log('🎯 VNPay callback detected!');
                handleDeepLink(event.url);
            }
        };

        // Listen for deep link events
        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

        // Check if app was opened with a deep link
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

    // ✅ JavaScript injection to intercept deep link redirect
    const injectedJavaScript = `
        (function() {
            console.log('🔧 VNPay interceptor loaded');
            
            // NUCLEAR OPTION: Override ALL navigation methods
            const blockAndExtract = function(url) {
                console.log('🔗 Navigation attempt to:', url);
                if (url && url.startsWith('emrs://')) {
                    console.log('🎯 BLOCKING deep link redirect and extracting data!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'deeplink',
                        url: url
                    }));
                    // Return false/null to prevent actual navigation
                    return false;
                }
                return true;
            };
            
            // Intercept window.location.href setter
            let currentHref = window.location.href;
            Object.defineProperty(window.location, 'href', {
                get: function() { return currentHref; },
                set: function(url) {
                    console.log('🔗 Setting location.href to:', url);
                    if (!blockAndExtract(url)) return;
                    currentHref = url;
                    window.location.replace(url);
                }
            });
            
            // Intercept window.location.replace
            const originalReplace = window.location.replace;
            window.location.replace = function(url) {
                console.log('🔗 Location.replace:', url);
                if (!blockAndExtract(url)) return;
                return originalReplace.call(window.location, url);
            };
            
            // Intercept window.location.assign
            const originalAssign = window.location.assign;
            window.location.assign = function(url) {
                console.log('🔗 Location.assign:', url);
                if (!blockAndExtract(url)) return;
                return originalAssign.call(window.location, url);
            };
            
            // Intercept window.open
            const originalOpen = window.open;
            window.open = function(url) {
                console.log('🔗 Window.open:', url);
                if (!blockAndExtract(url)) return null;
                return originalOpen.apply(this, arguments);
            };
            
            // Intercept anchor clicks
            document.addEventListener('click', function(e) {
                var target = e.target;
                while (target && target.tagName !== 'A') {
                    target = target.parentElement;
                }
                if (target && target.href) {
                    console.log('🔗 Link clicked:', target.href);
                    if (target.href.startsWith('emrs://')) {
                        e.preventDefault();
                        e.stopPropagation();
                        blockAndExtract(target.href);
                    }
                }
            }, true);
            
            // Intercept form submissions that might redirect
            document.addEventListener('submit', function(e) {
                console.log('📝 Form submitted');
                const form = e.target;
                if (form && form.action && form.action.startsWith('emrs://')) {
                    e.preventDefault();
                    blockAndExtract(form.action);
                }
            }, true);
            
            // Poll the DOM for the deep link URL
            let pollCount = 0;
            const maxPolls = 60; // 30 seconds
            const pollInterval = setInterval(function() {
                pollCount++;
                
                // Check all links
                const links = document.getElementsByTagName('a');
                for (let i = 0; i < links.length; i++) {
                    if (links[i].href && links[i].href.startsWith('emrs://')) {
                        console.log('🎯 Found deep link in DOM!');
                        blockAndExtract(links[i].href);
                        clearInterval(pollInterval);
                        return;
                    }
                }
                
                // Check meta refresh
                const metas = document.getElementsByTagName('meta');
                for (let i = 0; i < metas.length; i++) {
                    const content = metas[i].getAttribute('content');
                    const httpEquiv = metas[i].getAttribute('http-equiv');
                    if (httpEquiv && httpEquiv.toLowerCase() === 'refresh' && content) {
                        const urlMatch = content.match(/url=(.+)/i);
                        if (urlMatch && urlMatch[1] && urlMatch[1].startsWith('emrs://')) {
                            console.log('🎯 Found deep link in meta refresh!');
                            // Remove the meta tag to prevent auto-redirect
                            metas[i].parentNode.removeChild(metas[i]);
                            blockAndExtract(urlMatch[1]);
                            clearInterval(pollInterval);
                            return;
                        }
                    }
                }
                
                // Check page content for deep link
                const bodyText = document.body.innerHTML;
                const match = bodyText.match(/(emrs:\/\/payment\/callback\?[^"'<>\\s]+)/);
                if (match) {
                    console.log('🎯 Found deep link in page content!');
                    blockAndExtract(match[1]);
                    clearInterval(pollInterval);
                    return;
                }
                
                if (pollCount >= maxPolls) {
                    console.log('⏱️ Polling timeout');
                    clearInterval(pollInterval);
                }
            }, 500);
            
            console.log('✅ All interceptors installed');
        })();
        true;
    `;

    // Handle messages from WebView
    const onMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('📨 Message from WebView:', data);
            
            if (data.type === 'deeplink') {
                console.log('🎯 Deep link received from JavaScript:', data.url);
                handleDeepLink(data.url);
            }
        } catch (e) {
            console.error('❌ Failed to parse WebView message:', e);
        }
    }, [handleDeepLink]);

    // Backup: Handle navigation state changes
    const onNavigationStateChange = useCallback(
        (navState: WebViewNavigation) => {
            const url = navState.url || '';
            console.log('🔍 Navigation request:', url);
            console.log('🔍 Navigation state:', {
                canGoBack: navState.canGoBack,
                canGoForward: navState.canGoForward,
                loading: navState.loading,
                navigationType: navState.navigationType,
            });
            
            if (url.startsWith('emrs://')) {
                console.log('🎯 Deep link in navigation state:', url);
                handleDeepLink(url);
            }
        },
        [handleDeepLink]
    );

    // Final backup: onShouldStartLoadWithRequest
    const onShouldStartLoadWithRequest = useCallback(
        (request: any): boolean => {
            const url = request.url || '';
            console.log('🚦 onShouldStartLoadWithRequest:', url);
            
            // Intercept deep link
            if (url.startsWith('emrs://')) {
                console.log('🎯 Deep link detected in onShouldStartLoadWithRequest:', url);
                // Process it asynchronously but return false immediately
                setTimeout(() => handleDeepLink(url), 0);
                return false; // Block WebView from loading it
            }

            // Allow normal navigation
            return true;
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
                onLoadEnd={() => {
                    setLoading(false);
                    // Re-inject on every page load
                    webviewRef.current?.injectJavaScript(injectedJavaScript);
                }}
                injectedJavaScript={injectedJavaScript}
                injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
                onMessage={onMessage}
                onNavigationStateChange={onNavigationStateChange}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                javaScriptEnabled
                domStorageEnabled
                cacheEnabled={false}
                thirdPartyCookiesEnabled
                sharedCookiesEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                setSupportMultipleWindows={false}
                allowsBackForwardNavigationGestures={false}
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