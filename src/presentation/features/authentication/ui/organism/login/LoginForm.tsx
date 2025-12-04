import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PasswordInput } from '../../molecules/PasswordInput';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { colors } from '../../../../../common/theme/colors';
import { Input } from '../../../../../common/components';

interface LoginFormProps {
    onContinue: (data: { username: string; password: string }) => void;
    onForgotPassword?: () => void;
    loading?: boolean;
    error?: string;
    onErrorDismiss?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onContinue,
    onForgotPassword,
    loading = false,
    error,
    onErrorDismiss,
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (error && onErrorDismiss) {
            onErrorDismiss();
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (error && onErrorDismiss) {
            onErrorDismiss();
        }
    };

    const handleSubmit = () => {
        onContinue({ username, password });
    };

    const isValid = username && password;

    return (
        <View style={styles.container}>
            <Input
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Tên đăng nhập"
                autoCapitalize="none"
            />

            <PasswordInput
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Mật khẩu"
            />

            {/* Inline Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                </View>
            )}

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
    errorContainer: {
        marginTop: -8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red with 10% opacity for dark theme
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444', // Red-500
    },
    errorText: {
        color: '#FCA5A5', // Red-300 - lighter red for dark theme
        fontSize: 14,
        fontWeight: '500',
    },
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