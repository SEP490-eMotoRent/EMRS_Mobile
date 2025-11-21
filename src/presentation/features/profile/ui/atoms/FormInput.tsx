import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
    required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    error,
    required = false,
    ...props
    }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholderTextColor="#666"
            {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
    },
    required: {
        color: "#ff4444",
    },
    input: {
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 16,
    },
    inputError: {
        borderColor: "#ff4444",
    },
    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 4,
    },
});