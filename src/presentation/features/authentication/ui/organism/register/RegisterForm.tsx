// src/features/auth/components/organism/RegisterForm.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../../../../common/components/atoms/buttons/Button';
import { Input } from '../../../../../common/components/atoms/Input';

interface RegisterFormProps {
    onContinue: (data: { 
        username: string;
        email: string; 
        password: string; 
        confirmPassword: string;
    }) => void;
    loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onContinue, loading = false }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleContinue = () => {
        onContinue({ username, email, password, confirmPassword });
    };

    const isFormValid = 
        username.trim() !== '' && 
        email.trim() !== '' && 
        password.trim() !== '' && 
        confirmPassword.trim() !== '';

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!loading}
                />
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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
                <Input
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    editable={!loading}
                />
            </View>

            <Button
                title={loading ? 'Creating Account...' : 'Continue'}
                onPress={handleContinue}
                variant="primary"
                style={styles.continueButton}
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
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});