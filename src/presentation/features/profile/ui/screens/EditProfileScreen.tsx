import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { useRenterProfile } from '../../hooks/useRenterProfile';
import { useUpdateRenterProfile } from '../../hooks/useUpdateRenterProfile';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';

export const EditProfileScreen = ({ navigation }: any) => {
    // Fetch current user profile
    const { renter, renterResponse, loading: fetchLoading } = useRenterProfile();
    const { update, loading: updateLoading } = useUpdateRenterProfile();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode] = useState('+84');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [profileImageUri, setProfileImageUri] = useState<string | undefined>();

    // Document state
    const [citizenDoc, setCitizenDoc] = useState<DocumentResponse | undefined>();
    const [licenseDoc, setLicenseDoc] = useState<DocumentResponse | undefined>();

    // Populate form when data is loaded
    useEffect(() => {
        if (renter && renterResponse) {
            setFullName(renter.account?.fullname || '');
            setEmail(renter.email || '');
            
            // Extract phone number (remove country code if present)
            let phone = renter.phone || '';
            if (phone.startsWith('+84')) {
                phone = phone.substring(3);
            } else if (phone.startsWith('84')) {
                phone = phone.substring(2);
            }
            setPhoneNumber(phone);

            // Format date to DD/MM/YYYY for display
            if (renterResponse.dateOfBirth) {
                setDateOfBirth(renterResponse.dateOfBirth);
            }

            setAddress(renter.address || '');
            
            // Set existing avatar if available
            if (renter.avatarUrl) {
                setProfileImageUri(renter.avatarUrl);
            }

            // Extract documents
            const citizenDocument = renterResponse.documents.find(
                doc => doc.documentType === 'Citizen'
            );
            const licenseDocument = renterResponse.documents.find(
                doc => doc.documentType === 'License' || doc.documentType === 'DriverLicense'
            );

            setCitizenDoc(citizenDocument);
            setLicenseDoc(licenseDocument);
        }
    }, [renter, renterResponse]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setProfileImageUri(result.assets[0].uri);
        }
    };

    const handleViewDocument = (documentUrl: string) => {
        // Open document image in browser or image viewer
        Linking.openURL(documentUrl).catch(() => {
            Alert.alert('Error', 'Cannot open document image');
        });
    };

    const handleSave = async () => {
        try {
            // Only create file object if a NEW image was picked
            const file = profileImageUri && !profileImageUri.startsWith('http')
                ? {
                    uri: profileImageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                }
                : undefined;

            // Convert date from DD/MM/YYYY to YYYY-MM-DD
            let formattedDate = dateOfBirth;
            if (dateOfBirth.includes('/')) {
                const [day, month, year] = dateOfBirth.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }

            await update({
                email,
                phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,
                address: address,
                dateOfBirth: formattedDate,
                mediaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                fullname: fullName,
                profilePicture: file,
            });

            Alert.alert('Success', 'Profile updated!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        }
    };

    // Show loading while fetching initial data
    if (fetchLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    return (
        <EditProfileTemplate
            profileImageUri={profileImageUri}
            fullName={fullName}
            email={email}
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            dateOfBirth={dateOfBirth}
            // Citizen ID props
            citizenId={citizenDoc?.documentNumber || ''}
            citizenIdAutoFill={false}
            existingCitizenDoc={citizenDoc}
            // License props
            licenseNumber={licenseDoc?.documentNumber || ''}
            licenseClass=""
            licenseExpiry={licenseDoc?.expiryDate || ''}
            licenseAutoFill={false}
            existingLicenseDoc={licenseDoc}
            // Handlers
            onBack={() => navigation.goBack()}
            onSave={updateLoading ? undefined : handleSave}
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
            onViewCitizenDoc={() => citizenDoc?.fileUrl && handleViewDocument(citizenDoc.fileUrl)}
            onLicenseNumberChange={() => {}}
            onLicenseClassChange={() => {}}
            onLicenseExpiryPress={() => {}}
            onLicenseAutoFillChange={() => {}}
            onLicenseUpload={() => {}}
            onLicenseUpdate={() => {}}
            onViewLicenseDoc={() => licenseDoc?.fileUrl && handleViewDocument(licenseDoc.fileUrl)}
            onChangePassword={() => {}}
            saving={updateLoading}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});