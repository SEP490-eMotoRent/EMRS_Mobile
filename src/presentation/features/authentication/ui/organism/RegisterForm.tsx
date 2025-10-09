import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../../../common/components/atoms/Input';
import { Button } from '../../../../common/components/atoms/Button';


interface RegisterFormProps {
    onContinue: (data: { email: string; password: string; confirmPassword: string }) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onContinue }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleContinue = () => {
        onContinue({ email, password, confirmPassword });
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <Input
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                />
            </View>

            <Button
                title="Continue"
                onPress={handleContinue}
                variant="primary"
                style={styles.continueButton}
                textStyle={styles.continueButtonText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    continueButton: {
        backgroundColor: '#4285F4',
        borderWidth: 0,
        height: 56,
        borderRadius: 28,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});