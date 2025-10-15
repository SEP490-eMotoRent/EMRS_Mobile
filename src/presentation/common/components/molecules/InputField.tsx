import React, { ReactNode } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface InputFieldProps {
    icon: ReactNode;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    icon,
    value,
    onChangeText,
    placeholder,
}) => {
    return (
        <View style={styles.inputBox}>
            {icon}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#666"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputBox: {
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        padding: 0,
    },
});