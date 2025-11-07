import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '../atoms/Icons/Icons';
import { Text } from '../atoms/Text';

interface PhoneInputProps {
    label: string;
    countryCode: string;
    phoneNumber: string;
    onCountryCodePress: () => void;
    onPhoneNumberChange: (text: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    label,
    countryCode,
    phoneNumber,
    onCountryCodePress,
    onPhoneNumberChange,
    }) => {
    return (
        <View style={styles.container}>
        <Text variant="label" style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
            <TouchableOpacity style={styles.countryCode} onPress={onCountryCodePress}>
            <Text>{countryCode}</Text>
            <Icon name="dropdown" size={12} />
            </TouchableOpacity>
            <RNTextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={onPhoneNumberChange}
            placeholder="Số Điện Thoại"
            placeholderTextColor="#666666"
            keyboardType="phone-pad"
            />
        </View>
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
    inputRow: {
        flexDirection: 'row',
        gap: 8,
    },
    countryCode: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 90,
    },
    input: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
    },
});