// src/features/auth/components/atoms/OTPVerify/ResendCodeButton.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    ActivityIndicator, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';
import { colors } from '../../../../../common/theme/colors';

const COUNTDOWN_SECONDS = 60;

interface ResendCodeButtonProps {
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export const ResendCodeButton: React.FC<ResendCodeButtonProps> = ({ 
    onPress, 
    disabled = false,
    loading = false,
}) => {
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handlePress = useCallback(() => {
        if (canResend && !disabled && !loading) {
            setCountdown(COUNTDOWN_SECONDS);
            setCanResend(false);
            onPress();
        }
    }, [canResend, disabled, loading, onPress]);

    const isDisabled = !canResend || disabled || loading;

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.button.primary} />
                    <Text style={styles.loadingText}>Đang gửi...</Text>
                </View>
            );
        }

        if (canResend) {
            return <Text style={[styles.text, isDisabled && styles.textDisabled]}>Gửi lại mã</Text>;
        }

        return (
            <Text style={[styles.text, styles.textDisabled]}>
                Gửi lại sau {countdown}s
            </Text>
        );
    };

    return (
        <TouchableOpacity 
            onPress={handlePress} 
            disabled={isDisabled}
            style={styles.container}
            activeOpacity={0.7}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    text: {
        color: colors.button.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    textDisabled: {
        color: colors.text.secondary,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    loadingText: {
        color: colors.button.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});