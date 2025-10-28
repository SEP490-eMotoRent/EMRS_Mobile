import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';
import { useUpdateRenterProfile } from '../../hooks/useUpdateRenterProfile';

export const EditProfileScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState('John Nguyen');
    const [email, setEmail] = useState('john.nguyen@example.com');
    const [countryCode] = useState('+84');
    const [phoneNumber, setPhoneNumber] = useState('901 234 567');
    const [dateOfBirth] = useState('01/01/1990');
    const [profileImageUri, setProfileImageUri] = useState<string | undefined>();

    const { update, loading } = useUpdateRenterProfile();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
        setProfileImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        const file = profileImageUri
        ? {
            uri: profileImageUri,
            name: 'profile.jpg',
            type: 'image/jpeg',
            }
        : undefined;

        await update({
        email,
        phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,
        address: '',
        dateOfBirth: dateOfBirth.split('/').reverse().join('-'),
        mediaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        fullname: fullName,
        profilePicture: file,
        });

        Alert.alert('Success', 'Profile updated!');
        navigation.goBack();
    };

    return (
        <EditProfileTemplate
        profileImageUri={profileImageUri}
        fullName={fullName}
        email={email}
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        dateOfBirth={dateOfBirth}
        citizenId=""
        citizenIdAutoFill={false}
        licenseNumber=""
        licenseClass=""
        licenseExpiry=""
        licenseAutoFill={false}
        onBack={() => navigation.goBack()}
        onSave={loading ? undefined : handleSave}
        onCancel={() => navigation.goBack()}
        onChangePhoto={pickImage}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
        onCountryCodePress={() => {}}
        onPhoneNumberChange={setPhoneNumber}
        onDatePress={() => {}}
        onCitizenIdChange={() => {}}
        onCitizenIdAutoFillChange={() => {}}
        onCitizenIdUpload={() => {}}
        onCitizenIdUpdate={() => {}}
        onLicenseNumberChange={() => {}}
        onLicenseClassChange={() => {}}
        onLicenseExpiryPress={() => {}}
        onLicenseAutoFillChange={() => {}}
        onLicenseUpload={() => {}}
        onLicenseUpdate={() => {}}
        onChangePassword={() => {}}
        saving={loading}
        />
    );
};