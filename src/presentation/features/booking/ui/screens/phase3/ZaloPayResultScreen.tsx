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
                // console.log('⚠️ Already handled, ignoring polling result');
                return;
            }

            // console.log('🔔 [ZALOPAY POLLING] Status change detected:', status);

            if (status === 'Booked') {
                hasHandled.current = true;
                setPollingEnabled(false);
                setPaymentStatus('success');

                setTimeout(() => {
                    navigateToContract();
                }, 2000);
            } else if (status === 'Cancelled') {
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
            // console.log('📦 [CONTEXT] Loading booking context for:', bookingId);
            const STORAGE_KEY = `zalopay_payment_context_${bookingId}`;
            const contextJson = await AsyncStorage.getItem(STORAGE_KEY);

            if (contextJson) {
                const context: BookingContext = JSON.parse(contextJson);
                setBookingContext(context);
                // console.log('✅ [CONTEXT] Loaded successfully:', context);
            }
        } catch (error) {
            // console.error('❌ [CONTEXT] Load failed:', error);
        }
    };

    // ==================== HANDLE ZALOPAY CALLBACK ====================
    const handleZaloPayCallback = async (url: string) => {
        if (hasHandled.current || isProcessing) return;

        hasHandled.current = true;
        setIsProcessing(true);
        setPollingEnabled(false);

        try {
            const params = parseCallbackUrl(url);

            if (!params.status) {
                throw new Error('Missing status parameter in callback');
            }

            setTransactionId(params.apptransid || '');
            await verifyPaymentWithBackend(params);

        } catch (error: any) {
            setPaymentStatus('failed');
            setErrorMessage(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
        } finally {
            setIsProcessing(false);
        }
    };

    // ==================== PARSE CALLBACK URL ====================
    const parseCallbackUrl = (url: string): ZaloPayCallbackData => {
        try {
            const urlObj = new URL(url);
            const params: ZaloPayCallbackData = {};

            urlObj.searchParams.forEach((value, key) => {
                params[key.toLowerCase() as keyof ZaloPayCallbackData] = value;
            });

            return params;
        } catch {
            return {};
        }
    };

    // ==================== VERIFY WITH BACKEND ====================
    const verifyPaymentWithBackend = async (params: ZaloPayCallbackData) => {
        try {
            const isVerified = await container.booking.payment.verifyZaloPay.execute(
                params.appid ? parseInt(params.appid) : 0,
                params.apptransid || '',
                params.pmcid ? parseInt(params.pmcid) : 0,
                params.bankcode || '',
                params.amount ? parseInt(params.amount) : 0,
                params.discountamount ? parseInt(params.discountamount) : 0,
                params.status ? parseInt(params.status) : -1,
                params.checksum || ''
            );

            if (isVerified === true) {
                setPaymentStatus('success');
                setTimeout(() => navigateToContract(), 2000);
            } else {
                setPaymentStatus('failed');
                setErrorMessage('Thanh toán không thành công');
            }
        } catch (error: any) {
            setPaymentStatus('failed');
            setErrorMessage(error.message || 'Không thể xác nhận thanh toán với server');
        }
    };

    // ==================== NAVIGATE TO CONTRACT ====================
    const navigateToContract = () => {
        if (!bookingContext) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin booking');
            return;
        }

        AsyncStorage.removeItem(`zalopay_payment_context_${bookingId}`);

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
    };

    // ==================== DEEP LINK LISTENER ====================
    useEffect(() => {
        const handleDeepLinkEvent = (event: { url: string }) => {
            if (event.url.startsWith('emrs://payment/callback')) {
                handleZaloPayCallback(event.url);
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

        Linking.getInitialURL().then(url => {
            if (url?.startsWith('emrs://payment/callback')) {
                handleZaloPayCallback(url);
            }
        });

        return () => subscription.remove();
    }, [bookingContext, isProcessing]);

    // ==================== APP STATE LISTENER ====================
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            Linking.getInitialURL().then(url => {
                if (url?.startsWith('emrs://payment/callback')) {
                    handleZaloPayCallback(url);
                }
            });
        }
        appState.current = nextAppState;
    };

    const handleRetry = () => {
        setPollingEnabled(false);
        navigation.goBack();
    };

    const handleGoHome = () => {
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
                    <PrimaryButton title="Thử lại" onPress={handleRetry} />
                    <SecondaryButton title="Về trang chủ" onPress={handleGoHome} />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
    successIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#00ff00', justifyContent: 'center', alignItems: 'center' },
    errorIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ff4444', justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 60, color: '#000', fontWeight: 'bold' },
    successTitle: { color: '#00ff00', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
    successMessage: { color: '#fff', fontSize: 16, marginTop: 10 },
    errorTitle: { color: '#ff4444', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
    errorMessage: { color: '#999', fontSize: 16, marginTop: 10, textAlign: 'center' },
    waitingTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 20 },
    waitingMessage: { color: '#999', fontSize: 14, marginTop: 10, textAlign: 'center' },
    transactionId: { color: '#666', fontSize: 12, marginTop: 20 },
    redirectText: { color: '#999', fontSize: 14, marginTop: 10 },
    buttonContainer: { marginTop: 40, width: '100%', gap: 12 },
});