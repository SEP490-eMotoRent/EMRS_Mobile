import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '../../molecules/TextInput';
import { DateInput } from '../../molecules/DateInput';
import { Text } from '../../atoms/Text';

interface PersonalInfoSectionProps {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    onFullNameChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onPhoneNumberChange: (text: string) => void;
    onDatePress: () => void;
    onAddressChange: (text: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
    fullName,
    email,
    phoneNumber,
    dateOfBirth,
    address,
    onFullNameChange,
    onEmailChange,
    onPhoneNumberChange,
    onDatePress,
    onAddressChange,
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

            <TextInput
                label="Số Điện Thoại*"
                value={phoneNumber}
                onChangeText={onPhoneNumberChange}
                placeholder="Số Điện Thoại"
                keyboardType="phone-pad"
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