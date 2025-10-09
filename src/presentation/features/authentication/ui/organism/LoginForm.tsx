import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../../../common/components/atoms/Button';
import { Input } from '../../../../common/components/atoms/Input';

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