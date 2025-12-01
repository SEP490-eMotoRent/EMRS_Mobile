import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../common/theme/colors';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChangeText,
    placeholder = 'Mật khẩu',
    label,
    error,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <View style={[styles.inputContainer, error && styles.inputError]}>
            <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.input.placeholder}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            />
            
            <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
            activeOpacity={0.7}
            >
            <Ionicons
                name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color={colors.text.secondary}
            />
            </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.input.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.input.border,
        paddingHorizontal: 16,
        height: 56,
    },
    inputError: {
        borderColor: '#EF4444', // Red color for errors
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.input.text,
        paddingRight: 8,
    },
    eyeButton: {
        padding: 8,
        marginLeft: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444', // Red color for error text
        marginTop: 4,
        marginLeft: 4,
    },
});