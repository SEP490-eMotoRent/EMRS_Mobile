import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';
import { ProfileStackParamList } from '../../../../shared/navigation/types';

type EditProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

interface EditProfileScreenProps {
    navigation: EditProfileScreenNavigationProp;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
    const [profileImageUri, setProfileImageUri] = useState<string | undefined>(undefined);
    const [fullName, setFullName] = useState('John Nguyen');
    const [email, setEmail] = useState('john.nguyen@example.com');
    const [countryCode, setCountryCode] = useState('+84');
    const [phoneNumber, setPhoneNumber] = useState('901 234 567');
    const [dateOfBirth, setDateOfBirth] = useState('01/01/1990');
    const [citizenId, setCitizenId] = useState('');
    const [citizenIdAutoFill, setCitizenIdAutoFill] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseClass, setLicenseClass] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [licenseAutoFill, setLicenseAutoFill] = useState(false);

    const handleBack = () => navigation.goBack();
    const handleCancel = () => navigation.goBack();
    
    const handleSave = () => {
        console.log('Saving profile');
        // TODO: Implement API call
        navigation.goBack();
    };

    const handleChangePhoto = () => console.log('Change photo');
    const handleCountryCodePress = () => console.log('Open country code selector');
    const handleDatePress = () => console.log('Open date picker for date of birth');
    const handleLicenseExpiryPress = () => console.log('Open date picker for license expiry');
    const handleCitizenIdUpload = (method: 'camera' | 'gallery') => console.log('Upload citizen ID via:', method);
    const handleCitizenIdUpdate = () => console.log('Update citizen ID');
    const handleLicenseUpload = (method: 'camera' | 'gallery') => console.log('Upload license via:', method);
    const handleLicenseUpdate = () => console.log('Update license');
    const handleChangePassword = () => console.log('Change password');

    return (
        <EditProfileTemplate
            profileImageUri={profileImageUri}
            fullName={fullName}
            email={email}
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            dateOfBirth={dateOfBirth}
            citizenId={citizenId}
            citizenIdAutoFill={citizenIdAutoFill}
            licenseNumber={licenseNumber}
            licenseClass={licenseClass}
            licenseExpiry={licenseExpiry}
            licenseAutoFill={licenseAutoFill}
            onBack={handleBack}
            onSave={handleSave}
            onCancel={handleCancel}
            onChangePhoto={handleChangePhoto}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onCountryCodePress={handleCountryCodePress}
            onPhoneNumberChange={setPhoneNumber}
            onDatePress={handleDatePress}
            onCitizenIdChange={setCitizenId}
            onCitizenIdAutoFillChange={setCitizenIdAutoFill}
            onCitizenIdUpload={handleCitizenIdUpload}
            onCitizenIdUpdate={handleCitizenIdUpdate}
            onLicenseNumberChange={setLicenseNumber}
            onLicenseClassChange={setLicenseClass}
            onLicenseExpiryPress={handleLicenseExpiryPress}
            onLicenseAutoFillChange={setLicenseAutoFill}
            onLicenseUpload={handleLicenseUpload}
            onLicenseUpdate={handleLicenseUpdate}
            onChangePassword={handleChangePassword}
        />
    );
};