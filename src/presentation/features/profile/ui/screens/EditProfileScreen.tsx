import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';
import { useCreateDocument } from '../../hooks/documents/useCreateDocument';
import { useUpdateDocument } from '../../hooks/documents/useUpdateDocument';
import { useRenterProfile } from '../../hooks/profile/useRenterProfile';
import { useUpdateRenterProfile } from '../../hooks/profile/useUpdateRenterProfile';

// Helper: Normalize URI to string (handles string | string[] | undefined)
const normalizeUri = (uri: string | string[] | undefined): string | undefined => {
    if (!uri) return undefined;
    if (Array.isArray(uri)) {
        const firstItem = uri[0];
        return firstItem && typeof firstItem === 'string' ? firstItem : undefined;
    }
    return typeof uri === 'string' ? uri : undefined;
};

export const EditProfileScreen = ({ navigation }: any) => {
    // Fetch current user profile
    const { renter, renterResponse, loading: fetchLoading, refresh } = useRenterProfile();
    const { update, loading: updateLoading } = useUpdateRenterProfile();
    
    // Document hooks
    const { createCitizen, createDriving, loading: createDocLoading } = useCreateDocument();
    const { updateCitizen, updateDriving, loading: updateDocLoading } = useUpdateDocument();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode] = useState('+84');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [profileImageUri, setProfileImageUri] = useState<string | undefined>(undefined);

    // Document state
    const [citizenDoc, setCitizenDoc] = useState<DocumentResponse | undefined>();
    const [licenseDoc, setLicenseDoc] = useState<DocumentResponse | undefined>();

    // 🔥 NEW: Document images state (both front and back)
    const [citizenFrontImage, setCitizenFrontImage] = useState<string | undefined>();
    const [citizenBackImage, setCitizenBackImage] = useState<string | undefined>();
    const [licenseFrontImage, setLicenseFrontImage] = useState<string | undefined>();
    const [licenseBackImage, setLicenseBackImage] = useState<string | undefined>();

    // Document form state
    const [citizenIdNumber, setCitizenIdNumber] = useState('');
    const [citizenIssueDate, setCitizenIssueDate] = useState('');
    const [citizenExpiryDate, setCitizenExpiryDate] = useState('');
    const [citizenAuthority, setCitizenAuthority] = useState('');
    
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseClass, setLicenseClass] = useState('');
    const [licenseIssueDate, setLicenseIssueDate] = useState('');
    const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
    const [licenseAuthority, setLicenseAuthority] = useState('');

    // Populate form when data is loaded
    useEffect(() => {
        if (renter && renterResponse) {
            setFullName(renter.account?.fullname || '');
            setEmail(renter.email || '');

            let phone = renter.phone || '';
            if (phone.startsWith('+84')) {
                phone = phone.substring(3);
            } else if (phone.startsWith('84')) {
                phone = phone.substring(2);
            }
            setPhoneNumber(phone);

            if (renterResponse.dateOfBirth) {
                setDateOfBirth(renterResponse.dateOfBirth);
            }

            setAddress(renter.address || '');

            if (renter.avatarUrl) {
                const normalized = normalizeUri(renter.avatarUrl);
                setProfileImageUri(normalized);
            } else {
                setProfileImageUri(undefined);
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

            // Populate citizen ID fields
            if (citizenDocument) {
                setCitizenIdNumber(citizenDocument.documentNumber || '');
                setCitizenIssueDate(citizenDocument.issueDate || '');
                setCitizenExpiryDate(citizenDocument.expiryDate || '');
                setCitizenAuthority(citizenDocument.issuingAuthority || '');
            }

            // Populate license fields
            if (licenseDocument) {
                setLicenseNumber(licenseDocument.documentNumber || '');
                setLicenseIssueDate(licenseDocument.issueDate || '');
                setLicenseExpiryDate(licenseDocument.expiryDate || '');
                setLicenseAuthority(licenseDocument.issuingAuthority || '');
            }
        }
    }, [renter, renterResponse]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]) {
            const uri = normalizeUri(result.assets[0].uri);
            if (uri) {
                setProfileImageUri(uri);
            }
        }
    };

    // 🔥 NEW: Handle citizen document upload with camera or gallery
    const handleCitizenUpload = (method: 'camera' | 'gallery') => {
        if (method === 'camera') {
            // Navigate to camera for FRONT side first
            navigation.navigate('DocumentCapture', {
                documentType: 'citizen',
                side: 'front',
                onPhotoTaken: (uri: string, side: 'front' | 'back') => {
                    console.log('📸 Citizen front captured:', uri);
                    setCitizenFrontImage(uri);
                    
                    // Navigate to capture BACK side immediately after
                    setTimeout(() => {
                        navigation.navigate('DocumentCapture', {
                            documentType: 'citizen',
                            side: 'back',
                            onPhotoTaken: (backUri: string, backSide: 'front' | 'back') => {
                                console.log('📸 Citizen back captured:', backUri);
                                setCitizenBackImage(backUri);
                            },
                        });
                    }, 100);
                },
            });
        } else {
            // Gallery: pick both images sequentially
            pickCitizenFromGallery();
        }
    };

    const pickCitizenFromGallery = async () => {
        try {
            // Pick front image
            const frontResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (frontResult.canceled) return;

            const frontUri = normalizeUri(frontResult.assets[0].uri);
            if (!frontUri) return;

            setCitizenFrontImage(frontUri);

            // Pick back image
            const backResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (backResult.canceled) return;

            const backUri = normalizeUri(backResult.assets[0].uri);
            if (backUri) {
                setCitizenBackImage(backUri);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    // 🔥 NEW: Handle license document upload with camera or gallery
    const handleLicenseUpload = (method: 'camera' | 'gallery') => {
        if (method === 'camera') {
            navigation.navigate('DocumentCapture', {
                documentType: 'license',
                side: 'front',
                onPhotoTaken: (uri: string, side: 'front' | 'back') => {
                    console.log('📸 License front captured:', uri);
                    setLicenseFrontImage(uri);
                    
                    // Navigate to capture BACK side immediately after
                    setTimeout(() => {
                        navigation.navigate('DocumentCapture', {
                            documentType: 'license',
                            side: 'back',
                            onPhotoTaken: (backUri: string, backSide: 'front' | 'back') => {
                                console.log('📸 License back captured:', backUri);
                                setLicenseBackImage(backUri);
                            },
                        });
                    }, 100);
                },
            });
        } else {
            pickLicenseFromGallery();
        }
    };

    const pickLicenseFromGallery = async () => {
        try {
            const frontResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (frontResult.canceled) return;

            const frontUri = normalizeUri(frontResult.assets[0].uri);
            if (!frontUri) return;

            setLicenseFrontImage(frontUri);

            const backResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (backResult.canceled) return;

            const backUri = normalizeUri(backResult.assets[0].uri);
            if (backUri) {
                setLicenseBackImage(backUri);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    // 🔥 NEW: Date picker handlers
    const handleCitizenIssueDatePress = () => {
        // TODO: Open date picker modal
        Alert.alert('Date Picker', 'Implement date picker for citizen issue date');
    };

    const handleCitizenExpiryDatePress = () => {
        // TODO: Open date picker modal
        Alert.alert('Date Picker', 'Implement date picker for citizen expiry date');
    };

    const handleLicenseIssueDatePress = () => {
        // TODO: Open date picker modal
        Alert.alert('Date Picker', 'Implement date picker for license issue date');
    };

    const handleLicenseExpiryDatePress = () => {
        // TODO: Open date picker modal
        Alert.alert('Date Picker', 'Implement date picker for license expiry date');
    };

    const handleViewDocument = (documentUrl: string) => {
        Linking.openURL(documentUrl).catch(() => {
            Alert.alert('Error', 'Cannot open document image');
        });
    };

    // Handle citizen document submit
    const handleCitizenDocumentSubmit = async () => {
        try {
            if (!citizenIdNumber) {
                Alert.alert('Validation Error', 'Citizen ID number is required');
                return;
            }

            if (!citizenDoc) {
                // CREATE new document
                if (!citizenFrontImage || !citizenBackImage) {
                    Alert.alert('Validation Error', 'Both front and back images are required');
                    return;
                }

                const formatDate = (date: string) => {
                    if (!date) return undefined;
                    if (date.includes('/')) {
                        const [day, month, year] = date.split('/');
                        return `${year}-${month}-${day}`;
                    }
                    return date;
                };

                await createCitizen({
                    documentNumber: citizenIdNumber,
                    issueDate: formatDate(citizenIssueDate),
                    expiryDate: formatDate(citizenExpiryDate),
                    issuingAuthority: citizenAuthority,
                    verificationStatus: 'Pending',
                    frontDocumentFile: {
                        uri: citizenFrontImage,
                        name: 'citizen_front.jpg',
                        type: 'image/jpeg',
                    },
                    backDocumentFile: {
                        uri: citizenBackImage,
                        name: 'citizen_back.jpg',
                        type: 'image/jpeg',
                    },
                });

                Alert.alert('Success', 'Citizen ID uploaded successfully!');
                await refresh();
            } else {
                // UPDATE existing document
                const formatDate = (date: string) => {
                    if (!date) return undefined;
                    if (date.includes('/')) {
                        const [day, month, year] = date.split('/');
                        return `${year}-${month}-${day}`;
                    }
                    return date;
                };

                const mediaIds = citizenDoc.fileUrl;

                const updateRequest: any = {
                    id: citizenDoc.id,
                    documentNumber: citizenIdNumber,
                    issueDate: formatDate(citizenIssueDate),
                    expiryDate: formatDate(citizenExpiryDate),
                    issuingAuthority: citizenAuthority,
                    verificationStatus: citizenDoc.verificationStatus,
                    idFileFront: Array.isArray(mediaIds) ? mediaIds[0] : mediaIds,
                    idFileBack: Array.isArray(mediaIds) ? mediaIds[1] : mediaIds,
                };

                if (citizenFrontImage && !citizenFrontImage.startsWith('http')) {
                    updateRequest.frontDocumentFile = {
                        uri: citizenFrontImage,
                        name: 'citizen_front.jpg',
                        type: 'image/jpeg',
                    };
                }

                if (citizenBackImage && !citizenBackImage.startsWith('http')) {
                    updateRequest.backDocumentFile = {
                        uri: citizenBackImage,
                        name: 'citizen_back.jpg',
                        type: 'image/jpeg',
                    };
                }

                await updateCitizen(updateRequest);
                Alert.alert('Success', 'Citizen ID updated successfully!');
                await refresh();
            }

            setCitizenFrontImage(undefined);
            setCitizenBackImage(undefined);
        } catch (error: any) {
            console.error('❌ Citizen document error:', error);
            Alert.alert('Error', error.message || 'Failed to submit citizen document');
        }
    };

    // Handle license document submit
    const handleLicenseDocumentSubmit = async () => {
        try {
            if (!licenseNumber) {
                Alert.alert('Validation Error', 'License number is required');
                return;
            }

            if (!licenseDoc) {
                // CREATE new document
                if (!licenseFrontImage || !licenseBackImage) {
                    Alert.alert('Validation Error', 'Both front and back images are required');
                    return;
                }

                const formatDate = (date: string) => {
                    if (!date) return undefined;
                    if (date.includes('/')) {
                        const [day, month, year] = date.split('/');
                        return `${year}-${month}-${day}`;
                    }
                    return date;
                };

                await createDriving({
                    documentNumber: licenseNumber,
                    issueDate: formatDate(licenseIssueDate),
                    expiryDate: formatDate(licenseExpiryDate),
                    issuingAuthority: licenseAuthority,
                    verificationStatus: 'Pending',
                    frontDocumentFile: {
                        uri: licenseFrontImage,
                        name: 'license_front.jpg',
                        type: 'image/jpeg',
                    },
                    backDocumentFile: {
                        uri: licenseBackImage,
                        name: 'license_back.jpg',
                        type: 'image/jpeg',
                    },
                });

                Alert.alert('Success', 'Driver\'s License uploaded successfully!');
                await refresh();
            } else {
                // UPDATE existing document
                const formatDate = (date: string) => {
                    if (!date) return undefined;
                    if (date.includes('/')) {
                        const [day, month, year] = date.split('/');
                        return `${year}-${month}-${day}`;
                    }
                    return date;
                };

                const mediaIds = licenseDoc.fileUrl;

                const updateRequest: any = {
                    id: licenseDoc.id,
                    documentNumber: licenseNumber,
                    issueDate: formatDate(licenseIssueDate),
                    expiryDate: formatDate(licenseExpiryDate),
                    issuingAuthority: licenseAuthority,
                    verificationStatus: licenseDoc.verificationStatus,
                    idFileFront: Array.isArray(mediaIds) ? mediaIds[0] : mediaIds,
                    idFileBack: Array.isArray(mediaIds) ? mediaIds[1] : mediaIds,
                };

                if (licenseFrontImage && !licenseFrontImage.startsWith('http')) {
                    updateRequest.frontDocumentFile = {
                        uri: licenseFrontImage,
                        name: 'license_front.jpg',
                        type: 'image/jpeg',
                    };
                }

                if (licenseBackImage && !licenseBackImage.startsWith('http')) {
                    updateRequest.backDocumentFile = {
                        uri: licenseBackImage,
                        name: 'license_back.jpg',
                        type: 'image/jpeg',
                    };
                }

                await updateDriving(updateRequest);
                Alert.alert('Success', 'Driver\'s License updated successfully!');
                await refresh();
            }

            setLicenseFrontImage(undefined);
            setLicenseBackImage(undefined);
        } catch (error: any) {
            console.error('❌ License document error:', error);
            Alert.alert('Error', error.message || 'Failed to submit license document');
        }
    };

    const handleSave = async () => {
        try {
            if (!email || !phoneNumber || !address) {
                Alert.alert('Validation Error', 'Email, phone number, and address are required');
                return;
            }

            let formattedDate = dateOfBirth;
            if (dateOfBirth.includes('/')) {
                const [day, month, year] = dateOfBirth.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }

            const request: any = {
                Email: email.trim(),
                phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,
                Address: address.trim(),
                DateOfBirth: formattedDate,
                Fullname: fullName.trim(),
            };

            if (profileImageUri && !profileImageUri.startsWith('http')) {
                request.ProfilePicture = {
                    uri: profileImageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                };
            }

            const response = await update(request);

            if (response.AvatarUrl) {
                const normalized = normalizeUri(response.AvatarUrl);
                setProfileImageUri(normalized);
            }

            await refresh();

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error: any) {
            console.error('❌ Update error:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        }
    };

    if (fetchLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    const isSaving = updateLoading || createDocLoading || updateDocLoading;

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
            citizenId={citizenIdNumber}
            citizenIdAutoFill={false}
            existingCitizenDoc={citizenDoc}
            citizenFrontImage={citizenFrontImage}
            citizenBackImage={citizenBackImage}
            citizenIssueDate={citizenIssueDate}
            citizenExpiryDate={citizenExpiryDate}
            citizenAuthority={citizenAuthority}
            // License props
            licenseNumber={licenseNumber}
            licenseClass={licenseClass}
            licenseExpiry={licenseExpiryDate}
            licenseAutoFill={false}
            existingLicenseDoc={licenseDoc}
            licenseFrontImage={licenseFrontImage}
            licenseBackImage={licenseBackImage}
            licenseIssueDate={licenseIssueDate}
            licenseAuthority={licenseAuthority}
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
            onCitizenIdChange={setCitizenIdNumber}
            onCitizenIdAutoFillChange={() => {}}
            onCitizenIdUpload={handleCitizenUpload}
            onCitizenIdUpdate={handleCitizenDocumentSubmit}
            onViewCitizenDoc={() => citizenDoc?.fileUrl && handleViewDocument(
                Array.isArray(citizenDoc.fileUrl) ? citizenDoc.fileUrl[0] : citizenDoc.fileUrl
            )}
            onCitizenIssueDatePress={handleCitizenIssueDatePress}
            onCitizenExpiryDatePress={handleCitizenExpiryDatePress}
            onCitizenAuthorityChange={setCitizenAuthority}
            onLicenseNumberChange={setLicenseNumber}
            onLicenseClassChange={setLicenseClass}
            onLicenseExpiryPress={() => {}}
            onLicenseAutoFillChange={() => {}}
            onLicenseUpload={handleLicenseUpload}
            onLicenseUpdate={handleLicenseDocumentSubmit}
            onViewLicenseDoc={() => licenseDoc?.fileUrl && handleViewDocument(
                Array.isArray(licenseDoc.fileUrl) ? licenseDoc.fileUrl[0] : licenseDoc.fileUrl
            )}
            onLicenseIssueDatePress={handleLicenseIssueDatePress}
            onLicenseAuthorityChange={setLicenseAuthority}
            onChangePassword={() => {}}
            saving={isSaving}
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