// src/presentation/features/auth/organism/ChangePasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PrimaryButton } from '../../../../common/components/atoms/buttons/PrimaryButton';
import { PasswordInput } from '../molecules/PasswordInput';
import { colors } from '../../../../common/theme/colors';

interface ChangePasswordFormProps {
    onSubmit: (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
    loading?: boolean;
}

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validatePassword = (password: string): string | null => {
    if (!password) return 'Mật khẩu không được để trống';
    if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!/[A-Z]/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    if (!/[a-z]/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ thường';
    if (!/\d/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ số';
    if (!/[@$!%*?&]/.test(password)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (@$!%*?&)';
    if (!PASSWORD_REGEX.test(password)) return 'Mật khẩu chỉ chứa chữ, số và @$!%*?&';
    return null;
};

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    onSubmit,
    loading = false,
}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Error states
    const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    // Touched states (only show errors after user has interacted)
    const [currentPasswordTouched, setCurrentPasswordTouched] = useState(false);
    const [newPasswordTouched, setNewPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

    // Validate new password
    useEffect(() => {
        if (newPasswordTouched && newPassword) {
        const error = validatePassword(newPassword);
        setNewPasswordError(error);
        } else if (newPasswordTouched && !newPassword) {
        setNewPasswordError('Mật khẩu mới không được để trống');
        } else {
        setNewPasswordError(null);
        }
    }, [newPassword, newPasswordTouched]);

    // Validate confirm password
    useEffect(() => {
        if (confirmPasswordTouched) {
        if (!confirmPassword) {
            setConfirmPasswordError('Vui lòng xác nhận mật khẩu');
        } else if (confirmPassword !== newPassword) {
            setConfirmPasswordError('Mật khẩu xác nhận không khớp');
        } else {
            setConfirmPasswordError(null);
        }
        }
    }, [confirmPassword, newPassword, confirmPasswordTouched]);

    // Validate current password
    useEffect(() => {
        if (currentPasswordTouched) {
        if (!currentPassword) {
            setCurrentPasswordError('Mật khẩu hiện tại không được để trống');
        } else {
            setCurrentPasswordError(null);
        }
        }
    }, [currentPassword, currentPasswordTouched]);

    const handleSubmit = () => {
        // Mark all as touched
        setCurrentPasswordTouched(true);
        setNewPasswordTouched(true);
        setConfirmPasswordTouched(true);

        // Validate all fields
        const currentError = !currentPassword ? 'Mật khẩu hiện tại không được để trống' : null;
        const newError = validatePassword(newPassword);
        const confirmError = !confirmPassword 
        ? 'Vui lòng xác nhận mật khẩu'
        : confirmPassword !== newPassword
        ? 'Mật khẩu xác nhận không khớp'
        : null;

        setCurrentPasswordError(currentError);
        setNewPasswordError(newError);
        setConfirmPasswordError(confirmError);

        // Only submit if no errors
        if (!currentError && !newError && !confirmError) {
        onSubmit({
            currentPassword,
            newPassword,
            confirmPassword,
        });
        }
    };

    const isValid = 
        currentPassword && 
        newPassword && 
        confirmPassword && 
        !newPasswordError && 
        !confirmPasswordError &&
        !currentPasswordError;

    return (
        <View style={styles.container}>
        <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Mật khẩu hiện tại"
            error={currentPasswordTouched ? currentPasswordError || undefined : undefined}
            onBlur={() => setCurrentPasswordTouched(true)}
        />

        <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Mật khẩu mới"
            error={newPasswordTouched ? newPasswordError || undefined : undefined}
            onBlur={() => setNewPasswordTouched(true)}
        />

        {/* Password requirements hint */}
        {newPasswordTouched && newPassword && (
            <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
            <RequirementItem met={newPassword.length >= 8} text="Ít nhất 8 ký tự" />
            <RequirementItem met={/[A-Z]/.test(newPassword)} text="Có chữ hoa" />
            <RequirementItem met={/[a-z]/.test(newPassword)} text="Có chữ thường" />
            <RequirementItem met={/\d/.test(newPassword)} text="Có chữ số" />
            <RequirementItem met={/[@$!%*?&]/.test(newPassword)} text="Có ký tự đặc biệt (@$!%*?&)" />
            </View>
        )}

        <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Xác nhận mật khẩu mới"
            error={confirmPasswordTouched ? confirmPasswordError || undefined : undefined}
            onBlur={() => setConfirmPasswordTouched(true)}
        />

        <PrimaryButton
            title="Đổi mật khẩu"
            onPress={handleSubmit}
            disabled={!isValid || loading}
            loading={loading}
        />
        </View>
    );
};

// Helper component for password requirements
const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <View style={styles.requirementItem}>
        <Text style={[styles.requirementIcon, met && styles.requirementMet]}>
        {met ? '✓' : '○'}
        </Text>
        <Text style={[styles.requirementText, met && styles.requirementMet]}>
        {text}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        gap: 16,
    },
    requirementsContainer: {
        marginTop: -8,
        marginBottom: 8,
        padding: 12,
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.button.primary,
    },
    requirementsTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    requirementIcon: {
        fontSize: 14,
        marginRight: 8,
        color: colors.text.secondary,
    },
    requirementText: {
        fontSize: 13,
        color: colors.text.secondary,
    },
    requirementMet: {
        color: '#10B981', // Green color for met requirements
    },
});