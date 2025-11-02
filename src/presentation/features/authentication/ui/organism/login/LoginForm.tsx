// src/features/auth/components/organism/login/LoginForm.tsx
import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button } from '../../../../../common/components/atoms/buttons/Button';
import { Input } from '../../../../../common/components/atoms/Input';
import { LoginMethodSelector } from '../../molecules/login/LoginMethodSelector';

interface LoginFormProps {
    onContinue: (data: { username?: string; password?: string; phoneNumber?: string }) => void;
    loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onContinue, loading = false }) => {
    const [loginMethod, setLoginMethod] = useState<'credentials' | 'phone'>('credentials');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleContinue = () => {
        if (loginMethod === 'credentials') {
            onContinue({ username, password });
        } else {
            onContinue({ phoneNumber });
        }
    };

    const isFormValid = loginMethod === 'credentials' 
        ? username.trim() !== '' && password.trim() !== ''
        : phoneNumber.trim() !== '';

    const buttonStyle: ViewStyle = {
        ...styles.continueButton,
        ...((!isFormValid || loading) && styles.disabledButton)
    };

    return (
        <View style={styles.container}>
            <LoginMethodSelector
                selectedMethod={loginMethod}
                onMethodChange={setLoginMethod}
            />

            <View style={styles.inputContainer}>
                {loginMethod === 'credentials' ? (
                    <>
                        <Input
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            editable={!loading}
                        />
                    </>
                ) : (
                    <Input
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!loading}
                    />
                )}
            </View>

            <Button
                title={loading ? 'Signing In...' : 'Continue'}
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
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 32,
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