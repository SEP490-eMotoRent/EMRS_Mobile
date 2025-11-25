import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button } from '../../../../../common/components/atoms/buttons/Button';
import { Input } from '../../../../../common/components/atoms/Input';

interface LoginFormProps {
    onContinue: (data: { username: string; password: string }) => void;
    loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onContinue, loading = false }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleContinue = () => {
        onContinue({ username, password });
    };

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const buttonStyle: ViewStyle = {
        ...styles.continueButton,
        ...((!isFormValid || loading) && styles.disabledButton)
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!loading}
                    style={{ height: 70 }}
                />
                <Input
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    editable={!loading}
                    style={{ height: 70 }}
                />
            </View>

            <Button
                title={loading ? 'Đang đăng nhập...' : 'Tiếp tục'}
                onPress={handleContinue}
                variant="primary"
                style={buttonStyle}
                textStyle={styles.continueButtonText}
                disabled={!isFormValid || loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 40,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 28,
    },
    continueButton: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        height: 56,
        borderRadius: 28,
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});