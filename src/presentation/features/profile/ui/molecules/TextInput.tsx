import React from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps as RNTextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Text } from '../atoms/Text';

interface TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
    numberOfLines?: number;
    style?: StyleProp<ViewStyle>;
    secureTextEntry?: boolean;
    editable?: boolean;
    maxLength?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    multiline = false,
    numberOfLines = 1,
    style,
    secureTextEntry = false,
    editable = true,
    maxLength,
}) => {
    return (
        <View style={styles.container}>
            <Text variant="label" style={styles.label}>{label}</Text>
            <RNTextInput
                style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    style,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#666666"
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                multiline={multiline}
                numberOfLines={multiline ? numberOfLines : 1}
                textAlignVertical={multiline ? 'top' : 'center'}
                secureTextEntry={secureTextEntry}
                editable={editable}
                maxLength={maxLength}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 80,
        paddingTop: 12,
    },
});