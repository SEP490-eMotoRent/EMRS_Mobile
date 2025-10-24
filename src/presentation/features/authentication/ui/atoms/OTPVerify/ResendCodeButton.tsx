import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ResendCodeButtonProps {
    onPress: () => void;
    disabled?: boolean;
}

export const ResendCodeButton: React.FC<ResendCodeButtonProps> = ({ 
    onPress, 
    disabled = false 
}) => {
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handlePress = () => {
        if (canResend && !disabled) {
            setCountdown(60);
            setCanResend(false);
            onPress();
        }
    };

    return (
        <TouchableOpacity 
            onPress={handlePress} 
            disabled={!canResend || disabled}
            style={styles.container}
        >
            <Text style={[
                styles.text,
                (!canResend || disabled) && styles.textDisabled
            ]}>
                {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    text: {
        color: '#b8a4ff',
        fontSize: 16,
        fontWeight: '600',
    },
    textDisabled: {
        color: '#666',
    },
});