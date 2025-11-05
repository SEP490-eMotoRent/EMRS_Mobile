import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '../../molecules/TextInput';
import { PhoneInput } from '../../molecules/PhoneNumberInput';
import { DateInput } from '../../molecules/DateInput';
import { Text } from '../../atoms/Text';

interface PersonalInfoSectionProps {
    fullName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string; // ✅ ADD THIS
    onFullNameChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onCountryCodePress: () => void;
    onPhoneNumberChange: (text: string) => void;
    onDatePress: () => void;
    onAddressChange: (text: string) => void; // ✅ ADD THIS
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
    fullName,
    email,
    countryCode,
    phoneNumber,
    dateOfBirth,
    address, // ✅ RECEIVE THIS
    onFullNameChange,
    onEmailChange,
    onCountryCodePress,
    onPhoneNumberChange,
    onDatePress,
    onAddressChange, // ✅ RECEIVE THIS
}) => {
    return (
        <View style={styles.container}>
            <Text variant="title" style={styles.title}>Thông Tin Cá Nhân</Text>
            
            <TextInput
                label="Họ Tên*"
                value={fullName}
                onChangeText={onFullNameChange}
                placeholder="Điền Họ Tên"
            />

            <TextInput
                label="Email*"
                value={email}
                onChangeText={onEmailChange}
                placeholder="Điền Địa Chỉ Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <PhoneInput
                label="Số Điện Thoại*"
                countryCode={countryCode}
                phoneNumber={phoneNumber}
                onCountryCodePress={onCountryCodePress}
                onPhoneNumberChange={onPhoneNumberChange}
            />

            <DateInput
                label="Ngày Sinh*"
                value={dateOfBirth}
                onPress={onDatePress}
            />

            <TextInput
                label="Địa Chỉ*"
                value={address}
                onChangeText={onAddressChange}
                placeholder="Điền Địa Chỉ"
                multiline
                numberOfLines={3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        marginBottom: 16,
    },
});