import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../../../common/components/atoms/Input';
import { Button } from '../../../../common/components/atoms/Button';

interface LoginFormProps {
    onContinue: (phoneNumber: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onContinue }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleContinue = () => {
        onContinue(phoneNumber);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
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