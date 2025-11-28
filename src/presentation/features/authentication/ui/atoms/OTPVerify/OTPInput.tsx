// src/features/auth/components/atoms/OTPVerify/OTPInput.tsx
import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface OTPInputProps {
    value: string;
    index: number;
    onChangeText: (text: string, index: number) => void;
    onKeyPress: (e: any, index: number) => void;
    editable?: boolean;
}

export const OTPInput = forwardRef<TextInput, OTPInputProps>(({
    value,
    index,
    onChangeText,
    onKeyPress,
    editable = true,
}, ref) => {
    const isFilled = value !== '';

    return (
        <View style={styles.container}>
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    isFilled && styles.inputFilled,
                    !editable && styles.inputDisabled,
                ]}
                value={value}
                onChangeText={(text) => onChangeText(text, index)}
                onKeyPress={(e) => onKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={editable}
                autoFocus={index === 0}
                caretHidden
                contextMenuHidden
            />
        </View>
    );
});

OTPInput.displayName = 'OTPInput';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: 52,
    },
    input: {
        height: 56,
        borderWidth: 2,
        borderColor: colors.input.border,
        borderRadius: 12,
        backgroundColor: colors.input.background,
        color: colors.input.text,
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputFilled: {
        borderColor: colors.button.primary,
        backgroundColor: 'rgba(216, 180, 254, 0.15)', // button.primary with 15% opacity
    },
    inputDisabled: {
        opacity: 0.5,
    },
});