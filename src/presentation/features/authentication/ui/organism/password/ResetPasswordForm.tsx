import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input } from '../../../../../common/components/atoms/Input';
import { PasswordInput } from '../../molecules/PasswordInput';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { colors } from '../../../../../common/theme/colors';

interface ResetPasswordFormProps {
    onSubmit: (data: {
        otpCode: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
    loading?: boolean;
    error?: string;
    onErrorDismiss?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    onSubmit,
    loading = false,
    error,
    onErrorDismiss,
}) => {
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFieldChange = (setter: (value: string) => void) => (text: string) => {
        setter(text);
        if (error && onErrorDismiss) {
            onErrorDismiss();
        }
    };

    const handleSubmit = () => {
        onSubmit({ otpCode, newPassword, confirmPassword });
    };

    // Password validation
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
    const passwordValid = newPassword.length >= 8;
    const isValid = otpCode && newPassword && confirmPassword && passwordsMatch && passwordValid;

    return (
        <View style={styles.container}>
            <Text style={styles.description}>
                Nhập mã OTP đã được gửi đến email của bạn và mật khẩu mới.
            </Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="Mã OTP"
                    value={otpCode}
                    onChangeText={handleFieldChange(setOtpCode)}
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>

            <View style={styles.inputContainer}>
                <PasswordInput
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChangeText={handleFieldChange(setNewPassword)}
                />
            </View>

            <View style={styles.inputContainer}>
                <PasswordInput
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChangeText={handleFieldChange(setConfirmPassword)}
                />
            </View>

            {/* Password validation hints */}
            {newPassword && !passwordValid && (
                <View style={styles.hintContainer}>
                    <Text style={styles.hintText}>
                        ℹ️ Mật khẩu phải có ít nhất 8 ký tự
                    </Text>
                </View>
            )}

            {confirmPassword && !passwordsMatch && (
                <View style={styles.hintContainer}>
                    <Text style={styles.hintText}>
                        ℹ️ Mật khẩu xác nhận không khớp
                    </Text>
                </View>
            )}

            {/* Inline Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                </View>
            )}

            <PrimaryButton
                title="Đặt lại mật khẩu"
                onPress={handleSubmit}
                disabled={!isValid}
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
    hintContainer: {
        marginTop: -8,
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#3B82F6',
    },
    hintText: {
        color: '#93C5FD',
        fontSize: 13,
        fontWeight: '500',
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