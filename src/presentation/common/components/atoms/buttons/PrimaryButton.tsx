import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface PrimaryButtonProps {
    title: string;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
    flex?: boolean; // ✅ NEW: For side-by-side buttons
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
    flex = false, // ✅ NEW
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button, 
                flex && styles.flexButton, // ✅ NEW
                style,
                isDisabled && styles.buttonDisabled
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isDisabled}
        >
            {loading ? (
                <ActivityIndicator 
                    size="small" 
                    color={colors.button.text} 
                />
            ) : (
                <Text 
                    style={[
                        styles.text, 
                        textStyle,
                        isDisabled && styles.textDisabled
                    ]}
                    numberOfLines={1} // ✅ NEW: Prevent text overflow
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.button.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    flexButton: { // ✅ NEW: For side-by-side buttons
        flex: 1,
        paddingHorizontal: 12, // Reduce padding for tight spacing
    },
    text: {
        color: colors.button.text,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    textDisabled: {
        color: '#666',
    },
});