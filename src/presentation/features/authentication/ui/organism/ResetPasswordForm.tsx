import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../../common/components/atoms/Button';
import { Input } from '../../../../common/components/atoms/Input';


interface ResetPasswordFormProps {
    onSubmit: (email: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        onSubmit(email);
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
            </View>

            <Button
                title="Reset Password"
                onPress={handleSubmit}
                variant="primary"
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
});