import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Linking,
    AppState,
    AppStateStatus,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { SecondaryButton } from '../../../../homepage/ui/atoms/buttons/SecondaryButton';
import { container } from '../../../../../../core/di/ServiceContainer';
import { useBookingStatusPolling } from '../../../hooks/useBookingStatusPolling';

type RoutePropType = RouteProp<BookingStackParamList, 'ZaloPayResult'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'ZaloPayResult'>;

interface BookingContext {
    bookingId?: string;
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

interface ZaloPayCallbackData {
    appid?: string;
    apptransid?: string;
    pmcid?: string;
    bankcode?: string;
    amount?: string;
    discountamount?: string;
    status?: string;
    checksum?: string;
}

export const ZaloPayResultScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const appState = useRef(AppState.currentState);

    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [transactionId, setTransactionId] = useState<string>('');
    const [bookingContext, setBookingContext] = useState<BookingContext | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pollingEnabled, setPollingEnabled] = useState(true);
    const hasHandled = useRef(false);

    const { bookingId } = route.params;

    // ==================== STATUS POLLING ====================
    useBookingStatusPolling({
        bookingId,
        enabled: pollingEnabled && paymentStatus === 'pending' && !hasHandled.current,
        onStatusChange: (status) => {
            if (hasHandled.current) {
                console.log('⚠️ Already handled, ignoring polling result');
                return;
            }
            
            console.log('═══════════════════════════════════════════════════');
            console.log('🔔 [ZALOPAY POLLING] Status change detected:', status);
            console.log('═══════════════════════════════════════════════════');
            
            if (status === 'Booked') {
                console.log('✅ [ZALOPAY POLLING] Payment confirmed via polling!');
                console.log('🎯 [ZALOPAY POLLING] Deep link may have failed, but polling caught it');
                
                hasHandled.current = true;
                setPollingEnabled(false);
                setPaymentStatus('success');
                
                setTimeout(() => {
                    navigateToContract();
                }, 2000);
            } else if (status === 'Cancelled') {
                console.log('❌ [ZALOPAY POLLING] Booking cancelled');
                hasHandled.current = true;
                setPollingEnabled(false);
                setPaymentStatus('failed');
                setErrorMessage(
                    'Booking đã hết hạn. Nếu bạn đã thanh toán, ' +
                    'vui lòng liên hệ hỗ trợ với mã booking: ' + bookingId
                );
            }
        },
        pollingInterval: 3000,
        maxDuration: 15 * 60 * 1000,
    });

    // ==================== LOAD BOOKING CONTEXT ====================
    useEffect(() => {
        loadBookingContext();
    }, []);

    const loadBookingContext = async () => {
        try {
            console.log('📦 [CONTEXT] Loading booking context for:', bookingId);
            const STORAGE_KEY = `zalopay_payment_context_${bookingId}`;
            const contextJson = await AsyncStorage.getItem(STORAGE_KEY);
            
            if (contextJson) {
                const context: BookingContext = JSON.parse(contextJson);
                setBookingContext(context);
                console.log('✅ [CONTEXT] Loaded successfully:', context);
            } else {
                console.warn('⚠️ [CONTEXT] No context found for bookingId:', bookingId);
            }
        } catch (error) {
            console.error('❌ [CONTEXT] Load failed:', error);
        }
    };

    // ==================== HANDLE ZALOPAY CALLBACK ====================
    const handleZaloPayCallback = async (url: string) => {
        console.log('═══════════════════════════════════════════════════');
        console.log('🔔 [CALLBACK] Starting callback handling');
        console.log('═══════════════════════════════════════════════════');
        
        if (hasHandled.current) {
            console.log('⚠️ [CALLBACK] Already handled, ignoring duplicate');
            return;
        }
        
        if (isProcessing) {
            console.log('⏳ [CALLBACK] Already processing, ignoring duplicate');
            return;
        }

        console.log('📥 [CALLBACK] Raw URL:', url);
        hasHandled.current = true;
        setIsProcessing(true);
        setPollingEnabled(false);

        try {
            const params = parseCallbackUrl(url);
            console.log('📋 [CALLBACK] Parsed params:', JSON.stringify(params, null, 2));

            if (!params.status) {
                console.error('❌ [CALLBACK] Missing status parameter!');
                throw new Error('Missing status parameter in callback');
            }

            console.log('💳 [CALLBACK] Payment Status Code:', params.status);
            console.log('💰 [CALLBACK] Amount:', params.amount);
            console.log('🔖 [CALLBACK] Transaction ID:', params.apptransid);

            setTransactionId(params.apptransid || '');
            
            console.log('🔄 [CALLBACK] Starting payment verification...');
            await verifyPaymentWithBackend(params);

        } catch (error: any) {
            console.error('═══════════════════════════════════════════════════');
            console.error('❌ [CALLBACK] Processing ERROR:');
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            console.error('═══════════════════════════════════════════════════');
            
            setPaymentStatus('failed');
            setErrorMessage(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
        } finally {
            setIsProcessing(false);
            console.log('🏁 [CALLBACK] Processing finished');
        }
    };

    // ==================== PARSE CALLBACK URL ====================
    const parseCallbackUrl = (url: string): ZaloPayCallbackData => {
        console.log('🔍 [PARSE] Starting URL parsing...');
        try {
            const urlObj = new URL(url);
            console.log('🔍 [PARSE] URL object created');
            console.log('🔍 [PARSE] Hostname:', urlObj.hostname);
            console.log('🔍 [PARSE] Pathname:', urlObj.pathname);
            console.log('🔍 [PARSE] Search params:', urlObj.search);
            
            const params: ZaloPayCallbackData = {};

            urlObj.searchParams.forEach((value, key) => {
                const lowerKey = key.toLowerCase();
                console.log(`🔍 [PARSE] ${key} (${lowerKey}) = ${value}`);
                params[lowerKey as keyof ZaloPayCallbackData] = value;
            });

            console.log('✅ [PARSE] Parsed successfully:', JSON.stringify(params, null, 2));
            return params;
        } catch (error) {
            console.error('❌ [PARSE] Failed to parse URL:', error);
            return {};
        }
    };

    // ==================== VERIFY WITH BACKEND ====================
    const verifyPaymentWithBackend = async (params: ZaloPayCallbackData) => {
        console.log('═══════════════════════════════════════════════════');
        console.log('🔐 [VERIFY] Starting backend verification');
        console.log('═══════════════════════════════════════════════════');
        
        try {
            const appId = params.appid ? parseInt(params.appid) : 0;
            const appTransId = params.apptransid || '';
            const pmcId = params.pmcid ? parseInt(params.pmcid) : 0;
            const bankCode = params.bankcode || '';
            const amount = params.amount ? parseInt(params.amount) : 0;
            const discountAmount = params.discountamount ? parseInt(params.discountamount) : 0;
            const status = params.status ? parseInt(params.status) : -1;
            const checksum = params.checksum || '';

            console.log('📤 [VERIFY] Sending to use case:');
            console.log('   - AppId:', appId);
            console.log('   - AppTransId:', appTransId);
            console.log('   - PmcId:', pmcId);
            console.log('   - BankCode:', bankCode);
            console.log('   - Amount:', amount);
            console.log('   - DiscountAmount:', discountAmount);
            console.log('   - Status:', status, status === 1 ? '(SUCCESS)' : '(FAILED)');
            console.log('   - Checksum:', checksum);

            console.log('🎯 [VERIFY] Calling container.booking.payment.verifyZaloPay.execute()...');
            
            const isVerified = await container.booking.payment.verifyZaloPay.execute(
                appId,
                appTransId,
                pmcId,
                bankCode,
                amount,
                discountAmount,
                status,
                checksum
            );

            console.log('═══════════════════════════════════════════════════');
            console.log('📊 [VERIFY] Backend response received:');
            console.log('   - Verified:', isVerified);
            console.log('   - Type:', typeof isVerified);
            console.log('═══════════════════════════════════════════════════');

            if (isVerified === true) {
                console.log('✅ [VERIFY] Payment VERIFIED successfully!');
                console.log('🎉 [VERIFY] Setting status to SUCCESS');
                setPaymentStatus('success');
                
                console.log('⏰ [VERIFY] Scheduling navigation to contract in 2 seconds...');
                setTimeout(() => {
                    console.log('🚀 [VERIFY] Navigating to contract now...');
                    navigateToContract();
                }, 2000);
            } else {
                console.log('❌ [VERIFY] Payment verification FAILED');
                console.log('❌ [VERIFY] isVerified value:', isVerified);
                console.log('❌ [VERIFY] Setting status to FAILED');
                setPaymentStatus('failed');
                setErrorMessage('Thanh toán không thành công');
            }

        } catch (error: any) {
            console.error('═══════════════════════════════════════════════════');
            console.error('❌ [VERIFY] Payment verification ERROR:');
            console.error('❌ Error name:', error.name);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            console.error('❌ Full error:', JSON.stringify(error, null, 2));
            console.error('═══════════════════════════════════════════════════');
            
            setPaymentStatus('failed');
            setErrorMessage(error.message || 'Không thể xác nhận thanh toán với server');
        }
    };

    // ==================== NAVIGATE TO CONTRACT ====================
    const navigateToContract = () => {
        console.log('🧭 [NAVIGATE] Starting navigation to contract...');
        
        if (!bookingContext) {
            console.error('❌ [NAVIGATE] No booking context found!');
            Alert.alert('Lỗi', 'Không tìm thấy thông tin booking');
            return;
        }

        console.log('🧹 [NAVIGATE] Cleaning up AsyncStorage...');
        AsyncStorage.removeItem(`zalopay_payment_context_${bookingId}`);

        console.log('🚀 [NAVIGATE] Replacing screen with DigitalContract');
        console.log('📋 [NAVIGATE] Contract params:', {
            vehicleId: bookingContext.vehicleId,
            vehicleName: bookingContext.vehicleName,
            contractNumber: transactionId || bookingId
        });

        navigation.replace('DigitalContract', {
            vehicleId: bookingContext.vehicleId,
            vehicleName: bookingContext.vehicleName,
            vehicleImageUrl: bookingContext.vehicleImageUrl || '',
            startDate: bookingContext.startDate,
            endDate: bookingContext.endDate,
            duration: bookingContext.duration,
            rentalDays: bookingContext.rentalDays,
            branchName: bookingContext.branchName,
            insurancePlan: bookingContext.insurancePlan,
            totalAmount: bookingContext.totalAmount,
            securityDeposit: bookingContext.securityDeposit,
            contractNumber: transactionId || bookingId || '',
        });
        
        console.log('✅ [NAVIGATE] Navigation completed');
    };

    // ==================== DEEP LINK LISTENER ====================
    useEffect(() => {
        console.log('🎧 [LISTENER] Setting up deep link listeners...');
        
        const handleDeepLinkEvent = (event: { url: string }) => {
            console.log('🔗 [LISTENER] Deep link event received:', event.url);
            if (event.url.startsWith('emrs://payment/callback')) {
                console.log('✅ [LISTENER] Valid ZaloPay callback URL detected');
                handleZaloPayCallback(event.url);
            } else {
                console.log('⚠️ [LISTENER] URL does not match ZaloPay callback pattern');
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);
        console.log('✅ [LISTENER] Event listener registered');

        console.log('🔍 [LISTENER] Checking for initial URL...');
        Linking.getInitialURL().then(url => {
            if (url) {
                console.log('🔗 [LISTENER] Initial URL found:', url);
                if (url.startsWith('emrs://payment/callback')) {
                    console.log('✅ [LISTENER] Initial URL is ZaloPay callback');
                    handleZaloPayCallback(url);
                }
            } else {
                console.log('ℹ️ [LISTENER] No initial URL');
            }
        });

        return () => {
            console.log('🔌 [LISTENER] Removing event listener');
            subscription.remove();
        };
    }, [bookingContext, isProcessing]);

    // ==================== APP STATE LISTENER ====================
    useEffect(() => {
        console.log('📱 [APPSTATE] Setting up app state listener...');
        
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        return () => {
            console.log('🔌 [APPSTATE] Removing listener');
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        console.log('📱 [APPSTATE] State changed:', appState.current, '→', nextAppState);
        
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            console.log('✅ [APPSTATE] App returned to foreground - checking for deep link');
            Linking.getInitialURL().then(url => {
                if (url && url.startsWith('emrs://payment/callback')) {
                    console.log('🔗 [APPSTATE] Deep link found after return:', url);
                    handleZaloPayCallback(url);
                }
            });
        }
        appState.current = nextAppState;
    };

    // ==================== RETRY PAYMENT ====================
    const handleRetry = () => {
        console.log('🔄 [RETRY] User clicked retry, going back...');
        setPollingEnabled(false);
        navigation.goBack();
    };

    // ==================== GO HOME ====================
    const handleGoHome = () => {
        console.log('🏠 [HOME] User clicked go home, navigating to Trips...');
        setPollingEnabled(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Trips' }],
        });
    };

    // ==================== RENDER ====================
    if (paymentStatus === 'success') {
        return (
            <View style={styles.container}>
                <View style={styles.successIcon}>
                    <Text style={styles.iconText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Thanh toán thành công!</Text>
                <Text style={styles.successMessage}>
                    Đơn hàng của bạn đã được xác nhận
                </Text>
                {transactionId && (
                    <Text style={styles.transactionId}>
                        Mã giao dịch: {transactionId}
                    </Text>
                )}
                <ActivityIndicator size="small" color="#00ff00" style={{ marginTop: 20 }} />
                <Text style={styles.redirectText}>Đang chuyển đến hợp đồng...</Text>
            </View>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <View style={styles.container}>
                <View style={styles.errorIcon}>
                    <Text style={styles.iconText}>✕</Text>
                </View>
                <Text style={styles.errorTitle}>Thanh toán thất bại</Text>
                <Text style={styles.errorMessage}>{errorMessage || 'Đã có lỗi xảy ra'}</Text>
                
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title="Thử lại"
                        onPress={handleRetry}
                        style={styles.button}
                    />
                    <SecondaryButton
                        title="Về trang chủ"
                        onPress={handleGoHome}
                        style={styles.button}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.waitingTitle}>Chờ thanh toán...</Text>
            <Text style={styles.waitingMessage}>
                Vui lòng hoàn tất thanh toán trong ứng dụng ZaloPay
            </Text>
            {transactionId && (
                <Text style={styles.transactionId}>
                    Mã giao dịch: {transactionId}
                </Text>
            )}
            <Text style={styles.pollingHint}>
                Đang tự động kiểm tra trạng thái thanh toán...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#00ff00',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    errorIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconText: {
        fontSize: 60,
        color: '#000',
        fontWeight: 'bold',
    },
    successTitle: {
        color: '#00ff00',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    successMessage: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    errorTitle: {
        color: '#ff4444',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    errorMessage: {
        color: '#999',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    waitingTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
    },
    waitingMessage: {
        color: '#999',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    transactionId: {
        color: '#666',
        fontSize: 12,
        marginTop: 20,
        textAlign: 'center',
    },
    redirectText: {
        color: '#999',
        fontSize: 14,
        marginTop: 10,
    },
    pollingHint: {
        color: '#666',
        fontSize: 12,
        marginTop: 20,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    buttonContainer: {
        marginTop: 40,
        width: '100%',
        gap: 12,
    },
    button: {
        marginBottom: 12,
    },
});