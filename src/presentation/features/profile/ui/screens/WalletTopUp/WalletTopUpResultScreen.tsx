import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useWallet } from '../../../hooks/wallet/useWallet';

type RoutePropType = RouteProp<ProfileStackParamList, 'WalletTopUpResult'>;
type NavigationProp = StackNavigationProp<ProfileStackParamList, 'WalletTopUpResult'>;

export const WalletTopUpResultScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationProp>();
    const { refresh: refreshWallet } = useWallet();

    const { success, amount, transactionId, errorMessage } = route.params;

    const formatCurrency = (value: number): string => {
        return `${value.toLocaleString('vi-VN')}đ`;
    };

    const handleBackToWallet = async () => {
        if (success) {
            await refreshWallet();
        }
        navigation.popToTop();
    };

    const handleRetry = () => {
        navigation.replace('WalletTopUp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Icon */}
                <View style={[styles.iconContainer, success ? styles.successIcon : styles.failIcon]}>
                    <Text style={styles.iconText}>{success ? '✓' : '✕'}</Text>
                </View>

                {/* Title */}
                <Text style={[styles.title, success ? styles.successText : styles.failText]}>
                    {success ? 'Nạp tiền thành công!' : 'Nạp tiền thất bại'}
                </Text>

                {/* Amount */}
                <Text style={styles.amount}>{formatCurrency(amount)}</Text>

                {/* Message */}
                {success ? (
                    <Text style={styles.message}>
                        Số tiền đã được cộng vào ví của bạn
                    </Text>
                ) : (
                    <Text style={styles.errorMessage}>
                        {errorMessage || 'Đã xảy ra lỗi trong quá trình thanh toán'}
                    </Text>
                )}

                {/* Transaction ID */}
                {success && transactionId && (
                    <View style={styles.transactionInfo}>
                        <Text style={styles.transactionLabel}>Mã giao dịch:</Text>
                        <Text style={styles.transactionId}>{transactionId}</Text>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {success ? (
                    <PrimaryButton title="Quay về ví" onPress={handleBackToWallet} />
                ) : (
                    <>
                        <PrimaryButton title="Thử lại" onPress={handleRetry} />
                        <PrimaryButton
                            title="Quay về"
                            onPress={handleBackToWallet}
                            style={styles.secondaryButton}
                            textStyle={styles.secondaryButtonText}
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successIcon: { backgroundColor: '#22c55e' },
    failIcon: { backgroundColor: '#ef4444' },
    iconText: { fontSize: 40, color: '#fff', fontWeight: '700' },

    title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
    successText: { color: '#22c55e' },
    failText: { color: '#ef4444' },

    amount: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
    },

    message: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 15,
        color: '#ef4444',
        textAlign: 'center',
    },

    transactionInfo: {
        marginTop: 24,
        backgroundColor: '#1a1a1a',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    transactionLabel: { color: '#999', fontSize: 13, marginBottom: 4 },
    transactionId: { color: '#fff', fontSize: 14, fontWeight: '600' },

    footer: {
        padding: 16,
        paddingBottom: 32,
        gap: 12,
    },
    secondaryButton: {
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
    },
    secondaryButtonText: { color: '#fff' },
});