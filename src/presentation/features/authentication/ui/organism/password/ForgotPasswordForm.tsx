import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input } from '../../../../../common/components/atoms/Input';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { colors } from '../../../../../common/theme/colors';

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => void;
    loading?: boolean;
    error?: string;
    onErrorDismiss?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onSubmit,
    loading = false,
    error,
    onErrorDismiss,
}) => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (error && onErrorDismiss) {
            onErrorDismiss();
        }
    };

    const handleSubmit = () => {
        onSubmit(email);
    };

    const isValidEmail = email.includes('@') && email.includes('.');

    return (
        <View style={styles.container}>
            <Text style={styles.description}>
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
            </Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Inline Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                </View>
            )}

            <PrimaryButton
                title="Gửi mã OTP"
                onPress={handleSubmit}
                disabled={!isValidEmail}
                loading={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 24,
    },
    description: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    errorContainer: {
        marginTop: -8,
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444',
    },
    errorText: {
        color: '#FCA5A5',
        fontSize: 14,
        fontWeight: '500',
    },
});