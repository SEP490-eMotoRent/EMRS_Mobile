import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { PageHeader } from '../../../../booking/ui/molecules/PageHeader';
import { useWalletTopUp } from '../../../hooks/wallet/useWalletTopUp';

type NavigationProp = StackNavigationProp<ProfileStackParamList, 'WalletTopUp'>;

const QUICK_AMOUNTS = [
    { label: '100.000đ', value: 100000 },
    { label: '200.000đ', value: 200000 },
    { label: '500.000đ', value: 500000 },
    { label: '1.000.000đ', value: 1000000 },
    { label: '2.000.000đ', value: 2000000 },
    { label: '5.000.000đ', value: 5000000 },
];

export const WalletTopUpScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { createTopUpRequest, createTopUpZaloPayRequest, loading } = useWalletTopUp();

    const [amount, setAmount] = useState<string>('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'vnpay' | 'zalopay'>('vnpay');

    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('vi-VN');
    };

    const handleQuickAmountSelect = (value: number) => {
        setSelectedQuickAmount(value);
        setAmount(formatCurrency(value));
    };

    const handleAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        const parsed = parseInt(numericValue, 10) || 0;
        
        setSelectedQuickAmount(null);
        setAmount(parsed > 0 ? formatCurrency(parsed) : '');
    };

    const handleTopUp = async () => {
        if (parsedAmount < 10000) {
            Alert.alert('Lỗi', 'Số tiền nạp tối thiểu là 10.000đ');
            return;
        }

        if (parsedAmount > 50000000) {
            Alert.alert('Lỗi', 'Số tiền nạp tối đa là 50.000.000đ');
            return;
        }

        try {
            if (selectedPaymentMethod === 'vnpay') {
                // VNPay flow (existing)
                const result = await createTopUpRequest(parsedAmount);

                const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

                const context = {
                    transactionId: result.transactionId,
                    amount: parsedAmount,
                    transactionCode: result.transactionCode,
                };
                await AsyncStorage.setItem(
                    `vnpay_wallet_context_${result.transactionId}`,
                    JSON.stringify(context)
                );

                navigation.navigate('WalletVNPayWebView', {
                    vnpayUrl: result.vnPayUrl,
                    transactionId: result.transactionId,
                    amount: parsedAmount,
                    expiresAt,
                });
            } else {
                // ==================== ZALOPAY FLOW WITH LOGGING ====================
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🚀 [ZALOPAY WALLET] STARTING ZALOPAY FLOW');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📊 Amount:', parsedAmount);
                console.log('⏰ Timestamp:', new Date().toISOString());
                
                console.log('🔄 [ZALOPAY WALLET] Calling backend API...');
                const result = await createTopUpZaloPayRequest(parsedAmount);
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📥 [ZALOPAY WALLET] BACKEND RESPONSE:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Full Response:', JSON.stringify(result, null, 2));
                console.log('Transaction ID:', result.transactionId);
                console.log('Amount:', result.amount);
                console.log('Status:', result.status);
                console.log('Transaction Code:', result.transactionCode);
                console.log('Created At:', result.createdAt);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🔗 ZALOPAY URL:', result.zaloPayUrl);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                // ⚠️ CRITICAL VALIDATION
                if (!result.zaloPayUrl) {
                    console.error('❌ [ZALOPAY WALLET] ERROR: zaloPayUrl is NULL/UNDEFINED!');
                    console.error('Full result object:', result);
                    Alert.alert(
                        'Lỗi Backend',
                        'Backend không trả về ZaloPay URL.\n\n' +
                        'Response: ' + JSON.stringify(result, null, 2) + '\n\n' +
                        'Đây là lỗi BACKEND!'
                    );
                    return;
                }
                
                if (result.zaloPayUrl === 'https://payment-complete/') {
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('❌ [ZALOPAY WALLET] BACKEND RETURNED MOCK URL!');
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('This is a BACKEND BUG!');
                    console.error('ZaloPayService is returning mock URL instead of real ZaloPay URL');
                    console.error('Backend must call real ZaloPay API and return valid URL');
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    Alert.alert(
                        'Lỗi Backend - Mock URL',
                        '🔴 Backend trả về URL GIẢ: "https://payment-complete/"\n\n' +
                        '⚠️ Đây là lỗi BACKEND, không phải mobile!\n\n' +
                        'ZaloPayService đang return mock URL thay vì gọi ZaloPay API thật.\n\n' +
                        '✅ Backend cần fix ZaloPayService.cs để gọi ZaloPay API.'
                    );
                    return;
                }
                
                if (!result.zaloPayUrl.startsWith('http')) {
                    console.error('❌ [ZALOPAY WALLET] ERROR: Invalid URL format!');
                    console.error('URL received:', result.zaloPayUrl);
                    console.error('URL must start with http:// or https://');
                    Alert.alert(
                        'Lỗi Backend - Invalid URL',
                        'URL không hợp lệ: ' + result.zaloPayUrl + '\n\n' +
                        'URL phải bắt đầu với http:// hoặc https://'
                    );
                    return;
                }
                
                console.log('✅ [ZALOPAY WALLET] URL validation passed');
                console.log('📦 [ZALOPAY WALLET] Saving context to AsyncStorage...');

                const context = {
                    transactionId: result.transactionId,
                    amount: parsedAmount,
                    transactionCode: result.transactionCode,
                };
                
                console.log('Context data:', JSON.stringify(context, null, 2));
                
                await AsyncStorage.setItem(
                    `zalopay_wallet_context_${result.transactionId}`,
                    JSON.stringify(context)
                );
                
                console.log('✅ [ZALOPAY WALLET] Context saved successfully');
                console.log('🧭 [ZALOPAY WALLET] Navigating to WalletZaloPayResult...');
                console.log('Navigation params:', {
                    transactionId: result.transactionId,
                    amount: parsedAmount,
                    zaloPayUrl: result.zaloPayUrl,
                });

                navigation.navigate('WalletZaloPayResult', {
                    transactionId: result.transactionId,
                    amount: parsedAmount,
                    zaloPayUrl: result.zaloPayUrl,
                });
                
                console.log('✅ [ZALOPAY WALLET] Navigation dispatched');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }
        } catch (err: any) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ [ZALOPAY WALLET] EXCEPTION CAUGHT');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error object:', err);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            Alert.alert('Lỗi', err.message || 'Không thể tạo yêu cầu nạp tiền');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <PageHeader title="Nạp tiền vào ví" onBack={() => navigation.goBack()} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Amount Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Số tiền nạp</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={amount}
                                onChangeText={handleAmountChange}
                                placeholder="0"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                            />
                            <Text style={styles.currency}>đ</Text>
                        </View>
                        <Text style={styles.hint}>Tối thiểu 10.000đ - Tối đa 50.000.000đ</Text>
                    </View>

                    {/* Quick Amount Buttons */}
                    <View style={styles.quickAmountSection}>
                        <Text style={styles.sectionTitle}>Chọn nhanh</Text>
                        <View style={styles.quickAmountGrid}>
                            {QUICK_AMOUNTS.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[
                                        styles.quickAmountButton,
                                        selectedQuickAmount === item.value && styles.quickAmountButtonSelected,
                                    ]}
                                    onPress={() => handleQuickAmountSelect(item.value)}
                                >
                                    <Text
                                        style={[
                                            styles.quickAmountText,
                                            selectedQuickAmount === item.value && styles.quickAmountTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Payment Method Selection */}
                    <View style={styles.paymentMethodSection}>
                        <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
                        
                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                selectedPaymentMethod === 'vnpay' && styles.paymentOptionSelected,
                            ]}
                            onPress={() => setSelectedPaymentMethod('vnpay')}
                        >
                            <View style={styles.paymentOptionRow}>
                                <View style={styles.radioButton}>
                                    {selectedPaymentMethod === 'vnpay' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.paymentOptionContent}>
                                    <View style={styles.paymentOptionHeader}>
                                        <Text style={styles.paymentOptionTitle}>VNPay</Text>
                                        <View style={styles.vnpayBadge}>
                                            <Text style={styles.vnpayBadgeText}>Phổ biến</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.paymentOptionDesc}>
                                        Thanh toán qua cổng VNPay
                                    </Text>
                                    <Text style={styles.paymentMethodsText}>
                                        ATM • Visa • MasterCard • JCB • QR Code
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                selectedPaymentMethod === 'zalopay' && styles.paymentOptionSelected,
                            ]}
                            onPress={() => setSelectedPaymentMethod('zalopay')}
                        >
                            <View style={styles.paymentOptionRow}>
                                <View style={styles.radioButton}>
                                    {selectedPaymentMethod === 'zalopay' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.paymentOptionContent}>
                                    <View style={styles.paymentOptionHeader}>
                                        <Text style={styles.paymentOptionTitle}>ZaloPay</Text>
                                        <View style={styles.zaloPayBadge}>
                                            <Text style={styles.zaloPayBadgeText}>Mới</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.paymentOptionDesc}>
                                        Thanh toán qua ứng dụng ZaloPay
                                    </Text>
                                    <Text style={styles.paymentMethodsText}>
                                        Ví ZaloPay • Thẻ ATM • Visa • MasterCard
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Notice */}
                    <View style={styles.notice}>
                        <Text style={styles.noticeTitle}>Lưu ý</Text>
                        <Text style={styles.noticeText}>
                            • Tiền sẽ được cộng vào ví ngay sau khi thanh toán thành công
                        </Text>
                        <Text style={styles.noticeText}>
                            • Thời gian thanh toán: 15 phút
                        </Text>
                    </View>

                    {/* Bottom spacing for scroll */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Fixed Footer */}
                <View style={styles.footer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Số tiền nạp:</Text>
                        <Text style={styles.summaryValue}>
                            {parsedAmount > 0 ? `${formatCurrency(parsedAmount)}đ` : '0đ'}
                        </Text>
                    </View>
                    <PrimaryButton
                        title={loading ? 'Đang xử lý...' : 'Tiếp tục'}
                        onPress={handleTopUp}
                        disabled={loading || parsedAmount < 10000}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000' 
    },
    flex: { 
        flex: 1 
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },

    inputSection: { 
        marginBottom: 24 
    },
    label: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600', 
        marginBottom: 12 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
        paddingVertical: 16,
    },
    currency: { 
        color: '#999', 
        fontSize: 24, 
        fontWeight: '600' 
    },
    hint: { 
        color: '#666', 
        fontSize: 13, 
        marginTop: 8 
    },

    quickAmountSection: { 
        marginBottom: 24 
    },
    sectionTitle: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600', 
        marginBottom: 12 
    },
    quickAmountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickAmountButton: {
        width: '31%',
        backgroundColor: '#1a1a1a',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    quickAmountButtonSelected: {
        backgroundColor: '#1a1a2e',
        borderColor: '#c4b5fd',
    },
    quickAmountText: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600' 
    },
    quickAmountTextSelected: { 
        color: '#c4b5fd' 
    },

    paymentMethodSection: { 
        marginBottom: 24 
    },
    paymentOption: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 2,
        borderColor: '#333',
    },
    paymentOptionSelected: {
        borderColor: '#4169E1',
        backgroundColor: '#0f1729',
    },
    paymentOptionRow: { 
        flexDirection: 'row', 
        alignItems: 'flex-start' 
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4169E1',
    },
    paymentOptionContent: { 
        flex: 1 
    },
    paymentOptionHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 4 
    },
    paymentOptionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    paymentOptionDesc: { 
        color: '#999', 
        fontSize: 14, 
        marginBottom: 8 
    },
    paymentMethodsText: { 
        color: '#666', 
        fontSize: 12 
    },
    vnpayBadge: {
        backgroundColor: '#4169E1',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    vnpayBadgeText: { 
        color: '#fff', 
        fontSize: 11, 
        fontWeight: '600' 
    },
    zaloPayBadge: {
        backgroundColor: '#00a650',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    zaloPayBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600'
    },

    notice: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
    },
    noticeTitle: { 
        color: '#fbbf24', 
        fontSize: 14, 
        fontWeight: '600', 
        marginBottom: 8 
    },
    noticeText: { 
        color: '#999', 
        fontSize: 13, 
        lineHeight: 20, 
        marginBottom: 4 
    },

    bottomSpacing: {
        height: 20,
    },

    footer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryLabel: { 
        color: '#999', 
        fontSize: 15 
    },
    summaryValue: { 
        color: '#fff', 
        fontSize: 20, 
        fontWeight: '700' 
    },
});