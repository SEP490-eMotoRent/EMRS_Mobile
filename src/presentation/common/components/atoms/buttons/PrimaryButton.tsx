import React from 'react';
import { 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    ViewStyle, 
    TextStyle,
    ActivityIndicator,
    View
} from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface PrimaryButtonProps {
    title: string;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean; // ✅ Added loading prop
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button, 
                style,
                isDisabled && styles.buttonDisabled
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isDisabled}
        >
            {loading ? (
                // ✅ Show spinner when loading
                <ActivityIndicator 
                    size="small" 
                    color={colors.button.text} 
                />
            ) : (
                // ✅ Show text when not loading
                <Text style={[
                    styles.text, 
                    textStyle,
                    isDisabled && styles.textDisabled
                ]}>
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
        minHeight: 56, // ✅ Added to maintain height when loading
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