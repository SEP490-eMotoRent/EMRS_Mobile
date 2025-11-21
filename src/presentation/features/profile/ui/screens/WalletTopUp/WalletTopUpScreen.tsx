import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
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
    const { createTopUpRequest, loading } = useWalletTopUp();

    const [amount, setAmount] = useState<string>('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('vi-VN');
    };

    const handleQuickAmountSelect = (value: number) => {
        setSelectedQuickAmount(value);
        setAmount(formatCurrency(value));
    };

    const handleAmountChange = (text: string) => {
        // Remove non-numeric characters
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
            const result = await createTopUpRequest(parsedAmount);

            // Calculate expiry (15 minutes from now)
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

            // Store context
            const context = {
                transactionId: result.transactionId,
                amount: parsedAmount,
                transactionCode: result.transactionCode,
            };
            await AsyncStorage.setItem(
                `vnpay_wallet_context_${result.transactionId}`,
                JSON.stringify(context)
            );

            // Navigate to VNPay WebView
            navigation.navigate('WalletVNPayWebView', {
                vnpayUrl: result.vnPayUrl,
                transactionId: result.transactionId,
                amount: parsedAmount,
                expiresAt,
            });
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể tạo yêu cầu nạp tiền');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <PageHeader title="Nạp tiền vào ví" onBack={() => navigation.goBack()} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
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

                    {/* Payment Method Info */}
                    <View style={styles.paymentInfo}>
                        <View style={styles.paymentHeader}>
                            <Text style={styles.paymentTitle}>Phương thức thanh toán</Text>
                        </View>
                        <View style={styles.paymentMethod}>
                            <View style={styles.vnpayBadge}>
                                <Text style={styles.vnpayText}>VNPay</Text>
                            </View>
                            <Text style={styles.paymentDesc}>
                                ATM • Visa • MasterCard • JCB • QR Code
                            </Text>
                        </View>
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
                        <Text style={styles.noticeText}>
                            • Nếu gặp sự cố, vui lòng liên hệ hotline: 1900 xxxx
                        </Text>
                    </View>
                </ScrollView>

                {/* Footer */}
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
    container: { flex: 1, backgroundColor: '#000' },
    flex: { flex: 1 },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },

    inputSection: { marginBottom: 24 },
    label: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
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
    currency: { color: '#999', fontSize: 24, fontWeight: '600' },
    hint: { color: '#666', fontSize: 13, marginTop: 8 },

    quickAmountSection: { marginBottom: 24 },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
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
    quickAmountText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    quickAmountTextSelected: { color: '#c4b5fd' },

    paymentInfo: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    paymentHeader: { marginBottom: 12 },
    paymentTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
    paymentMethod: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    vnpayBadge: {
        backgroundColor: '#4169E1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    vnpayText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    paymentDesc: { color: '#999', fontSize: 13, flex: 1 },

    notice: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
    },
    noticeTitle: { color: '#fbbf24', fontSize: 14, fontWeight: '600', marginBottom: 8 },
    noticeText: { color: '#999', fontSize: 13, lineHeight: 20, marginBottom: 4 },

    footer: {
        padding: 16,
        paddingBottom: 32,
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
    summaryLabel: { color: '#999', fontSize: 15 },
    summaryValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
