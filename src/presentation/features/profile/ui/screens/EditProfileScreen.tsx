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

    // Form state - ENFORCE STRING TYPE
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

    // NEW: Document upload state
    const [citizenFrontImage, setCitizenFrontImage] = useState<string | undefined>();
    const [citizenBackImage, setCitizenBackImage] = useState<string | undefined>();
    const [licenseFrontImage, setLicenseFrontImage] = useState<string | undefined>();
    const [licenseBackImage, setLicenseBackImage] = useState<string | undefined>();

    // NEW: Document form state
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

    // NEW: Citizen document image picker
    const pickCitizenImage = async (method: 'camera' | 'gallery', side: 'front' | 'back') => {
        try {
            let result;
            
            if (method === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert('Permission needed', 'Camera permission is required');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    quality: 0.8,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets?.[0]) {
                const uri = normalizeUri(result.assets[0].uri);
                if (uri) {
                    if (side === 'front') {
                        setCitizenFrontImage(uri);
                    } else {
                        setCitizenBackImage(uri);
                    }
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    // NEW: License document image picker
    const pickLicenseImage = async (method: 'camera' | 'gallery', side: 'front' | 'back') => {
        try {
            let result;
            
            if (method === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert('Permission needed', 'Camera permission is required');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    quality: 0.8,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets?.[0]) {
                const uri = normalizeUri(result.assets[0].uri);
                if (uri) {
                    if (side === 'front') {
                        setLicenseFrontImage(uri);
                    } else {
                        setLicenseBackImage(uri);
                    }
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleViewDocument = (documentUrl: string) => {
        Linking.openURL(documentUrl).catch(() => {
            Alert.alert('Error', 'Cannot open document image');
        });
    };

    // NEW: Handle citizen document upload/update
    const handleCitizenDocumentSubmit = async () => {
        try {
            // Validation
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

                // Convert dates to YYYY-MM-DD format if needed
                const formatDate = (date: string) => {
                    if (!date) return undefined;
                    if (date.includes('/')) {
                        const [day, month, year] = date.split('/');
                        return `${year}-${month}-${day}`;
                    }
                    return date;
                };

                const response = await createCitizen({
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

                // Get existing media IDs (you'll need to extract these from citizenDoc.fileUrl)
                // For now, using placeholder - you may need to adjust based on your API response structure
                const mediaIds = citizenDoc.fileUrl; // This should be an array of media IDs

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

                // Only add files if user picked new images
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

                const response = await updateCitizen(updateRequest);
                Alert.alert('Success', 'Citizen ID updated successfully!');
                await refresh();
            }

            // Clear image state
            setCitizenFrontImage(undefined);
            setCitizenBackImage(undefined);
        } catch (error: any) {
            console.error('❌ Citizen document error:', error);
            Alert.alert('Error', error.message || 'Failed to submit citizen document');
        }
    };

    // NEW: Handle license document upload/update
    const handleLicenseDocumentSubmit = async () => {
        try {
            // Validation
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

                const response = await createDriving({
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

                const response = await updateDriving(updateRequest);
                Alert.alert('Success', 'Driver\'s License updated successfully!');
                await refresh();
            }

            // Clear image state
            setLicenseFrontImage(undefined);
            setLicenseBackImage(undefined);
        } catch (error: any) {
            console.error('❌ License document error:', error);
            Alert.alert('Error', error.message || 'Failed to submit license document');
        }
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

            // Build request with EXACT backend field names
            const request: any = {
                Email: email.trim(),
                phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,
                Address: address.trim(),
                DateOfBirth: formattedDate,
                Fullname: fullName.trim(),
            };

            // Only add ProfilePicture if user picked a new image (not an existing URL)
            if (profileImageUri && !profileImageUri.startsWith('http')) {
                request.ProfilePicture = {
                    uri: profileImageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                };
            }

            // Call the update hook
            const response = await update(request);

            // Update the profile image with the new URL from response
            if (response.AvatarUrl) {
                const normalized = normalizeUri(response.AvatarUrl);
                setProfileImageUri(normalized);
            }

            // Refresh the profile data
            await refresh();

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error: any) {
            console.error('❌ Update error:', error);
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
            // License props
            licenseNumber={licenseNumber}
            licenseClass={licenseClass}
            licenseExpiry={licenseExpiryDate}
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
            onCitizenIdChange={setCitizenIdNumber}
            onCitizenIdAutoFillChange={() => {}}
            onCitizenIdUpload={(method) => pickCitizenImage(method, 'front')} // For now, handle both images
            onCitizenIdUpdate={handleCitizenDocumentSubmit}
            onViewCitizenDoc={() => citizenDoc?.fileUrl && handleViewDocument(
                Array.isArray(citizenDoc.fileUrl) ? citizenDoc.fileUrl[0] : citizenDoc.fileUrl
            )}
            onLicenseNumberChange={setLicenseNumber}
            onLicenseClassChange={setLicenseClass}
            onLicenseExpiryPress={() => {}}
            onLicenseAutoFillChange={() => {}}
            onLicenseUpload={(method) => pickLicenseImage(method, 'front')} // For now, handle both images
            onLicenseUpdate={handleLicenseDocumentSubmit}
            onViewLicenseDoc={() => licenseDoc?.fileUrl && handleViewDocument(
                Array.isArray(licenseDoc.fileUrl) ? licenseDoc.fileUrl[0] : licenseDoc.fileUrl
            )}
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