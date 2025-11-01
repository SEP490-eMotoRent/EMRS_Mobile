import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { useRenterProfile } from '../../hooks/useRenterProfile';
import { useUpdateRenterProfile } from '../../hooks/useUpdateRenterProfile';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';

export const EditProfileScreen = ({ navigation }: any) => {
    // Fetch current user profile
    const { renter, renterResponse, loading: fetchLoading, refresh } = useRenterProfile();
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
        Linking.openURL(documentUrl).catch(() => {
            Alert.alert('Error', 'Cannot open document image');
        });
    };

    const handleSave = async () => {
        try {
            // Validation
            if (!email || !phoneNumber || !address) {
                Alert.alert('Validation Error', 'Email, phone number, and address are required');
                return;
            }

            // Convert date from DD/MM/YYYY to YYYY-MM-DD for backend
            let formattedDate = dateOfBirth;
            if (dateOfBirth.includes('/')) {
                const [day, month, year] = dateOfBirth.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }

            // 🔍 DEBUG: Check values before building request
            console.log('=== BEFORE UPDATE ===');
            console.log('Email:', email.trim());
            console.log('Phone:', `${countryCode}${phoneNumber.replace(/\s/g, '')}`);
            console.log('Address:', address.trim());
            console.log('DateOfBirth:', formattedDate);
            console.log('Fullname:', fullName.trim());
            console.log('ProfilePicture URI:', profileImageUri);
            console.log('Is HTTP?:', profileImageUri?.startsWith('http'));
            console.log('===================');

            // ✅ Build request with EXACT backend field names
            const request: any = {
                Email: email.trim(),              // ⚠️ Capital 'E'
                phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,  // ⚠️ Lowercase 'p'
                Address: address.trim(),          // ⚠️ Capital 'A'
                DateOfBirth: formattedDate,       // ⚠️ Capital 'D', 'B'
                Fullname: fullName.trim(),        // ⚠️ Capital 'F'
            };

            // Only add ProfilePicture if user picked a new image (not an existing URL)
            if (profileImageUri && !profileImageUri.startsWith('http')) {
                request.ProfilePicture = {
                    uri: profileImageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                };
            }

            console.log('=== SENDING REQUEST ===');
            console.log(JSON.stringify(request, null, 2));
            console.log('======================');

            // Call the update hook
            const response = await update(request);

            // Update the profile image with the new URL from response
            if (response.AvatarUrl) {
                setProfileImageUri(response.AvatarUrl);
            }

            // Refresh the profile data
            await refresh();

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        }
    };

    // Show loading while fetching initial data
    if (fetchLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
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
            address={address}
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
            onSave={handleSave}
            onCancel={() => navigation.goBack()}
            onChangePhoto={pickImage}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onCountryCodePress={() => {}}
            onPhoneNumberChange={setPhoneNumber}
            onDatePress={() => {}}
            onAddressChange={setAddress}
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