import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { BookingStackParamList } from '../../../../../shared/navigation/StackParameters/types';

type NavigationPropType = StackNavigationProp<BookingStackParamList>;

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

export const ZaloPayResultScreen: React.FC = () => {
    const navigation = useNavigation<NavigationPropType>();
    
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // ✅ Listen for deep link (same pattern as VNPay)
    useEffect(() => {
        const handleDeepLinkEvent = (event: { url: string }) => {
            console.log('🔗 Deep link event received:', event.url);
            if (event.url.startsWith('emotorent://payment-result')) {
                console.log('🎯 ZaloPay callback detected!');
                handleZaloPayCallback(event.url);
            }
        };

        // Listen for deep link events
        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

        // Check if app was opened with a deep link
        Linking.getInitialURL().then(url => {
            if (url && url.startsWith('emotorent://payment-result')) {
                console.log('🎯 App opened with ZaloPay callback:', url);
                handleZaloPayCallback(url);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleZaloPayCallback = async (url: string) => {
        try {
            console.log('🔄 Processing ZaloPay callback URL:', url);
            
            // Parse URL parameters
            const urlObj = new URL(url);
            const params = {
                amount: urlObj.searchParams.get('amount'),
                appid: urlObj.searchParams.get('appid'),
                apptransid: urlObj.searchParams.get('apptransid'),
                bankcode: urlObj.searchParams.get('bankcode'),
                checksum: urlObj.searchParams.get('checksum'),
                discountamount: urlObj.searchParams.get('discountamount'),
                pmcid: urlObj.searchParams.get('pmcid'),
                status: urlObj.searchParams.get('status'),
            };

            console.log('📦 ZaloPay params:', params);

            // Status: 1 = success, -1 = failed, 2 = processing
            if (params.status === '1') {
                console.log('✅ Payment successful!');
                setPaymentSuccess(true);
                setLoading(false);
                
                // Wait a moment for UI
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Navigate to contract
                await navigateToContract(params.apptransid || '');
            } else {
                console.error('❌ Payment failed or cancelled');
                setPaymentSuccess(false);
                setErrorMessage(
                    params.status === '-1' 
                        ? 'Thanh toán thất bại. Vui lòng thử lại.' 
                        : 'Thanh toán đang được xử lý.'
                );
                setLoading(false);
            }
        } catch (error: any) {
            console.error('❌ Error processing payment:', error);
            setPaymentSuccess(false);
            setErrorMessage('Có lỗi xảy ra khi xử lý thanh toán.');
            setLoading(false);
        }
    };

    const navigateToContract = async (apptransid: string) => {
        const STORAGE_KEY = `zalopay_payment_context_${apptransid}`;
        const ctxStr = await AsyncStorage.getItem(STORAGE_KEY);
        const ctx: BookingContext | null = ctxStr ? JSON.parse(ctxStr) : null;

        if (!ctx) {
            console.error('❌ No context found for booking:', apptransid);
            Alert.alert('Lỗi', 'Không tìm thấy thông tin đặt xe.');
            return;
        }

        navigation.replace('DigitalContract', {
            vehicleId: ctx.vehicleId,
            vehicleName: ctx.vehicleName,
            vehicleImageUrl: ctx.vehicleImageUrl || '',
            startDate: ctx.startDate,
            endDate: ctx.endDate,
            duration: ctx.duration,
            rentalDays: ctx.rentalDays,
            branchName: ctx.branchName,
            insurancePlan: ctx.insurancePlan,
            totalAmount: ctx.totalAmount,
            securityDeposit: ctx.securityDeposit,
            contractNumber: apptransid || 'N/A',
        });

        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    };

    const handleRetry = () => {
        navigation.goBack();
    };

    const handleBackToHome = () => {
        navigation.navigate('ConfirmRentalDuration' as any);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#00a650" />
                    <Text style={styles.loadingText}>Chờ thanh toán ZaloPay...</Text>
                    <Text style={styles.subText}>Vui lòng hoàn tất thanh toán trong ứng dụng ZaloPay</Text>
                </View>
            </View>
        );
    }

    if (paymentSuccess) {
        return (
            <View style={styles.container}>
                <View style={styles.center}>
                    <View style={styles.successIcon}>
                        <Text style={styles.successIconText}>✓</Text>
                    </View>
                    <Text style={styles.successTitle}>Thanh toán thành công!</Text>
                    <Text style={styles.successMessage}>
                        Đang chuyển đến hợp đồng thuê xe...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.center}>
                <View style={styles.failureIcon}>
                    <Text style={styles.failureIconText}>✕</Text>
                </View>
                <Text style={styles.failureTitle}>Thanh toán thất bại</Text>
                <Text style={styles.failureMessage}>{errorMessage}</Text>
                
                <View style={styles.buttonContainer}>
                    <PrimaryButton 
                        title="Thử lại" 
                        onPress={handleRetry}
                        style={styles.button}
                    />
                    <PrimaryButton 
                        title="Về trang chủ" 
                        onPress={handleBackToHome}
                        style={StyleSheet.flatten([styles.button, styles.secondaryButton])}
                        textStyle={styles.secondaryButtonText}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    loadingText: { color: '#fff', fontSize: 16, marginTop: 16 },
    subText: { color: '#999', fontSize: 14, marginTop: 8, textAlign: 'center' },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successIconText: { fontSize: 48, color: '#fff', fontWeight: '700' },
    successTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
    successMessage: { color: '#999', fontSize: 16, textAlign: 'center' },
    failureIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    failureIconText: { fontSize: 48, color: '#fff', fontWeight: '700' },
    failureTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
    failureMessage: { color: '#999', fontSize: 16, textAlign: 'center', marginBottom: 32 },
    buttonContainer: { width: '100%', marginBottom: 24 },
    button: { marginBottom: 12 },
    secondaryButton: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#00a650' },
    secondaryButtonText: { color: '#00a650' },
});