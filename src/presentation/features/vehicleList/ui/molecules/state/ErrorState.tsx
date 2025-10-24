import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    retryButtonText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
    title = 'Oops! Something went wrong',
    message,
    onRetry,
    retryButtonText = 'Try Again'
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={onRetry}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>{retryButtonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
        minHeight: 400,
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        color: colors.text.secondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: colors.button.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.button.text,
        fontSize: 16,
        fontWeight: '600',
    },
});