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
    onFullNameChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onCountryCodePress: () => void;
    onPhoneNumberChange: (text: string) => void;
    onDatePress: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
    fullName,
    email,
    countryCode,
    phoneNumber,
    dateOfBirth,
    onFullNameChange,
    onEmailChange,
    onCountryCodePress,
    onPhoneNumberChange,
    onDatePress,
}) => {
    return (
        <View style={styles.container}>
        <Text variant="title" style={styles.title}>Personal Information</Text>
        
        <TextInput
            label="Full Name*"
            value={fullName}
            onChangeText={onFullNameChange}
            placeholder="Enter your full name"
        />

        <TextInput
            label="Email Address*"
            value={email}
            onChangeText={onEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
        />

        <PhoneInput
            label="Phone Number*"
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryCodePress={onCountryCodePress}
            onPhoneNumberChange={onPhoneNumberChange}
        />

        <DateInput
            label="Date of Birth*"
            value={dateOfBirth}
            onPress={onDatePress}
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
