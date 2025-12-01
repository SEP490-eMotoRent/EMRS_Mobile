import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from '../../../../common/components/atoms/buttons/PrimaryButton';
import { PasswordInput } from '../molecules/PasswordInput';

interface ChangePasswordFormProps {
    onSubmit: (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
    loading?: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    onSubmit,
    loading = false,
}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        onSubmit({
        currentPassword,
        newPassword,
        confirmPassword,
        });
    };

    const isValid = currentPassword && newPassword && confirmPassword;

    return (
        <View style={styles.container}>
        <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Mật khẩu hiện tại"
        />

        <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Mật khẩu mới"
        />

        <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Xác nhận mật khẩu mới"
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

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        gap: 16,
    },
});