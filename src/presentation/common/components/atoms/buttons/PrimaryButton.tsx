import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface PrimaryButtonProps {
    title: string;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean; // ✅ Added
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false, // ✅ Added with default value
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button, 
                style,
                disabled && styles.buttonDisabled // ✅ Added disabled style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled} // ✅ Added disabled prop
        >
            <Text style={[
                styles.text, 
                textStyle,
                disabled && styles.textDisabled // ✅ Added disabled text style
            ]}>
                {title}
            </Text>
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
        width: '100%',
    },
    text: {
        color: colors.button.text,
        fontSize: 16,
        fontWeight: '600',
    },
    // ✅ Added disabled styles
    buttonDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    textDisabled: {
        color: '#666',
    },
});