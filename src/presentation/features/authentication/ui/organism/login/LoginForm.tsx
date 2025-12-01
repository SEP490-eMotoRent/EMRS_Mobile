import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { PasswordInput } from '../../molecules/PasswordInput';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { colors } from '../../../../../common/theme/colors';
import { Input } from '../../../../../common/components';

interface LoginFormProps {
    onContinue: (data: { username: string; password: string }) => void;
    onForgotPassword?: () => void; // ✅ Add this
    loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onContinue,
    onForgotPassword, // ✅ Add this
    loading = false,
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onContinue({ username, password });
    };

    const isValid = username && password;

    return (
        <View style={styles.container}>
        <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Tên đăng nhập"
            autoCapitalize="none"
        />

        <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mật khẩu"
        />

        {/* Add Forgot Password link */}
        {onForgotPassword && (
            <TouchableOpacity 
            onPress={onForgotPassword}
            style={styles.forgotPasswordContainer}
            >
            <Text style={styles.forgotPasswordText}>
                Quên mật khẩu?
            </Text>
            </TouchableOpacity>
        )}

        <PrimaryButton
            title="Đăng nhập"
            onPress={handleSubmit}
            disabled={!isValid}
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
    // ✅ Add these styles
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: -8,
        marginBottom: 8,
    },
    forgotPasswordText: {
        color: colors.text.accent,
        fontSize: 14,
        fontWeight: '600',
    },
});