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
    return (
        <View style={styles.container}>
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    value !== '' && styles.inputFilled,
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
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 6,
    },
    input: {
        height: 60,
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
        borderColor: '#b8a4ff',
        backgroundColor: 'rgba(184, 164, 255, 0.1)',
    },
    inputDisabled: {
        opacity: 0.5,
    },
});