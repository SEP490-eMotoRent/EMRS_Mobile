import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface EmptyStateProps {
    icon?: string;
    title?: string;
    message?: string;
    actionButtonText?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    icon = '🏍️',
    title = 'Không có xe nào',
    message = 'Hiện không tìm thấy xe nào phù hợp với tiêu chí của bạn. Vui lòng thử lại sau hoặc thay đổi bộ lọc tìm kiếm.',
    actionButtonText = 'Tải Lại',
    onAction
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {onAction && (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={onAction}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>{actionButtonText}</Text>
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
        maxWidth: 300,
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