import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { useCreateDocument } from '../../hooks/documents/useCreateDocument';
import { useDeleteDocument } from '../../hooks/documents/useDeleteDocument';
import { useUpdateDocument } from '../../hooks/documents/useUpdateDocument';
import { useRenterProfile } from '../../hooks/profile/useRenterProfile';
import { useUpdateRenterProfile } from '../../hooks/profile/useUpdateRenterProfile';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';
import { DatePickerModal } from '../organisms/DatePickerModal';
import { useDocumentOCR } from '../../hooks/documents/useDocumentOCR';

// Helper: Normalize URI to string (handles string | string[] | undefined)
const normalizeUri = (uri: string | string[] | undefined): string | undefined => {
    if (!uri) return undefined;
    if (Array.isArray(uri)) {
        const firstItem = uri[0];
        return firstItem && typeof firstItem === 'string' ? firstItem : undefined;
    }
    return typeof uri === 'string' ? uri : undefined;
};

// Helper: Convert DD/MM/YYYY to YYYY-MM-DD
const convertDisplayToISO = (displayDate: string): string | undefined => {
    if (!displayDate || !displayDate.trim()) return undefined;
    if (!displayDate.includes('/')) return undefined;
    
    const parts = displayDate.split('/');
    if (parts.length !== 3) return undefined;
    
    const [day, month, year] = parts;
    if (!day || !month || !year) return undefined;
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Helper: Convert YYYY-MM-DD to DD/MM/YYYY
const convertISOToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    if (isoDate.includes('/')) return isoDate; // Already in display format
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

export const EditProfileScreen = ({ navigation }: any) => {
    // Fetch current user profile
    const { renter, renterResponse, loading: fetchLoading, refresh } = useRenterProfile();
    const { update, loading: updateLoading } = useUpdateRenterProfile();
    
    // Document hooks
    const { createCitizen, createDriving, loading: createDocLoading } = useCreateDocument();
    const { updateCitizen, updateDriving, loading: updateDocLoading } = useUpdateDocument();
    const { deleteDocument, loading: deleteLoading } = useDeleteDocument();

    // OCR hook
    const { processCitizenID, processDriverLicense, loading: ocrLoading } = useDocumentOCR();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode] = useState('+84');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [profileImageUri, setProfileImageUri] = useState<string | undefined>(undefined);

    // Date picker state
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Document state
    const [citizenDoc, setCitizenDoc] = useState<DocumentResponse | undefined>();
    const [licenseDoc, setLicenseDoc] = useState<DocumentResponse | undefined>();

    // Document images state (both front and back)
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

    // Auto-fill toggles
    const [citizenAutoFill, setCitizenAutoFill] = useState(true);
    const [licenseAutoFill, setLicenseAutoFill] = useState(true);

    // OCR processing states
    const [citizenOCRProcessing, setCitizenOCRProcessing] = useState(false);
    const [licenseOCRProcessing, setLicenseOCRProcessing] = useState(false);

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
                doc => doc.documentType === 'Driving' || doc.documentType === 'License' || doc.documentType === 'DriverLicense'
            );

            setCitizenDoc(citizenDocument);
            setLicenseDoc(licenseDocument);

            // Populate citizen ID fields
            if (citizenDocument) {
                setCitizenIdNumber(citizenDocument.documentNumber || '');
                if (citizenDocument.issueDate) {
                    setCitizenIssueDate(convertISOToDisplay(citizenDocument.issueDate));
                }
                if (citizenDocument.expiryDate) {
                    setCitizenExpiryDate(convertISOToDisplay(citizenDocument.expiryDate));
                }
                setCitizenAuthority(citizenDocument.issuingAuthority || '');
            }

            // Populate license fields
            if (licenseDocument) {
                setLicenseNumber(licenseDocument.documentNumber || '');
                if (licenseDocument.issueDate) {
                    setLicenseIssueDate(convertISOToDisplay(licenseDocument.issueDate));
                }
                if (licenseDocument.expiryDate) {
                    setLicenseExpiryDate(convertISOToDisplay(licenseDocument.expiryDate));
                }
                setLicenseAuthority(licenseDocument.issuingAuthority || '');
            }
        }
    }, [renter, renterResponse]);

    // OCR Processing for Citizen ID
    useEffect(() => {
        const processOCR = async () => {
            if (!citizenAutoFill || !citizenFrontImage || !citizenBackImage) return;
            if (citizenDoc) return; // Don't OCR if document already exists
            
            setCitizenOCRProcessing(true);
            
            try {
                const result = await processCitizenID(citizenFrontImage, citizenBackImage);
                
                if (result) {
                    // Fill in the fields with OCR data
                    if (result.documentNumber) setCitizenIdNumber(result.documentNumber);
                    if (result.issueDate) setCitizenIssueDate(result.issueDate);
                    if (result.expiryDate) setCitizenExpiryDate(result.expiryDate);
                    if (result.authority) setCitizenAuthority(result.authority);
                }
            } catch (error) {
                console.error('Citizen OCR error:', error);
            } finally {
                setCitizenOCRProcessing(false);
            }
        };

        processOCR();
    }, [citizenFrontImage, citizenBackImage, citizenAutoFill, citizenDoc]);

    // OCR Processing for Driver's License
    useEffect(() => {
        const processOCR = async () => {
            if (!licenseAutoFill || !licenseFrontImage || !licenseBackImage) return;
            if (licenseDoc) return; // Don't OCR if document already exists
            
            setLicenseOCRProcessing(true);
            
            try {
                const result = await processDriverLicense(licenseFrontImage, licenseBackImage);
                
                if (result) {
                    // Fill in the fields with OCR data
                    if (result.documentNumber) setLicenseNumber(result.documentNumber);
                    if (result.issueDate) setLicenseIssueDate(result.issueDate);
                    if (result.expiryDate) setLicenseExpiryDate(result.expiryDate);
                    if (result.authority) setLicenseAuthority(result.authority);
                    if (result.licenseClass) setLicenseClass(result.licenseClass);
                }
            } catch (error) {
                console.error('License OCR error:', error);
            } finally {
                setLicenseOCRProcessing(false);
            }
        };

        processOCR();
    }, [licenseFrontImage, licenseBackImage, licenseAutoFill, licenseDoc]);

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

    const handleDateOfBirthPress = () => {
        setShowDatePicker(true);
    };

    const handleDateOfBirthConfirm = (date: string) => {
        setDateOfBirth(date);
    };

    const handleCitizenUpload = (method: 'camera' | 'gallery') => {
        if (method === 'camera') {
            navigation.navigate('DocumentCapture', {
                documentType: 'citizen',
                side: 'front',
                onPhotoTaken: (uri: string, side: 'front' | 'back') => {
                    console.log('📸 Citizen front captured:', uri);
                    setCitizenFrontImage(uri);
                    
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
            pickCitizenFromGallery();
        }
    };

    const pickCitizenFromGallery = async () => {
        try {
            const frontResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (frontResult.canceled) return;

            const frontUri = normalizeUri(frontResult.assets[0].uri);
            if (!frontUri) return;

            setCitizenFrontImage(frontUri);

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

    const handleLicenseUpload = (method: 'camera' | 'gallery') => {
        if (method === 'camera') {
            navigation.navigate('DocumentCapture', {
                documentType: 'license',
                side: 'front',
                onPhotoTaken: (uri: string, side: 'front' | 'back') => {
                    console.log('📸 License front captured:', uri);
                    setLicenseFrontImage(uri);
                    
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

    const handleCitizenIssueDatePress = () => {
        Alert.alert('Date Picker', 'Implement date picker for citizen issue date');
    };

    const handleCitizenExpiryDatePress = () => {
        Alert.alert('Date Picker', 'Implement date picker for citizen expiry date');
    };

    const handleLicenseIssueDatePress = () => {
        Alert.alert('Date Picker', 'Implement date picker for license issue date');
    };

    const handleLicenseExpiryDatePress = () => {
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

                // ✅ Ensure dates are properly converted or omitted
                const issueDate = convertDisplayToISO(citizenIssueDate);
                const expiryDate = convertDisplayToISO(citizenExpiryDate);

                // ✅ Build request with conditional fields
                const createRequest: any = {
                    documentNumber: citizenIdNumber,
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
                };

                // Only add optional fields if they have values
                if (issueDate) createRequest.issueDate = issueDate;
                if (expiryDate) createRequest.expiryDate = expiryDate;
                if (citizenAuthority && citizenAuthority.trim()) {
                    createRequest.issuingAuthority = citizenAuthority;
                }

                console.log('📤 CREATE CITIZEN REQUEST:');
                console.log('  documentNumber:', createRequest.documentNumber);
                console.log('  issueDate:', createRequest.issueDate);
                console.log('  expiryDate:', createRequest.expiryDate);
                console.log('  issuingAuthority:', createRequest.issuingAuthority);
                console.log('  verificationStatus:', createRequest.verificationStatus);
                console.log('  frontFile uri:', createRequest.frontDocumentFile.uri);
                console.log('  backFile uri:', createRequest.backDocumentFile.uri);
                console.log('\n📋 FULL REQUEST OBJECT:');
                console.log(JSON.stringify(createRequest, null, 2));
                
                console.log('\n🔍 OCR EXTRACTED VALUES (before conversion):');
                console.log('  Raw citizenIssueDate:', citizenIssueDate);
                console.log('  Raw citizenExpiryDate:', citizenExpiryDate);
                console.log('  Raw citizenAuthority:', citizenAuthority);
                console.log('  Raw citizenIdNumber:', citizenIdNumber);

                await createCitizen(createRequest);

                Alert.alert('Success', 'Citizen ID uploaded successfully!');
                await refresh();
            } else {
                // UPDATE existing document
                if (!citizenDoc.images || citizenDoc.images.length < 2) {
                    Alert.alert(
                        'Invalid Document', 
                        'Existing document is missing images. Please upload both front and back images.'
                    );
                    return;
                }

                const updateRequest: any = {
                    id: citizenDoc.id,
                    documentNumber: citizenIdNumber,
                    issueDate: convertDisplayToISO(citizenIssueDate),
                    expiryDate: convertDisplayToISO(citizenExpiryDate),
                    issuingAuthority: citizenAuthority,
                    verificationStatus: citizenDoc.verificationStatus,
                    idFileFront: citizenDoc.images[0].id,
                    idFileBack: citizenDoc.images[1].id,
                };

                // Only add new files if user uploaded them
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

                await createDriving({
                    documentNumber: licenseNumber,
                    issueDate: convertDisplayToISO(licenseIssueDate),
                    expiryDate: convertDisplayToISO(licenseExpiryDate),
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
                if (!licenseDoc.images || licenseDoc.images.length < 2) {
                    Alert.alert(
                        'Invalid Document', 
                        'Existing document is missing images. Please upload both front and back images.'
                    );
                    return;
                }

                const updateRequest: any = {
                    id: licenseDoc.id,
                    documentNumber: licenseNumber,
                    issueDate: convertDisplayToISO(licenseIssueDate),
                    expiryDate: convertDisplayToISO(licenseExpiryDate),
                    issuingAuthority: licenseAuthority,
                    verificationStatus: licenseDoc.verificationStatus,
                    idFileFront: licenseDoc.images[0].id,
                    idFileBack: licenseDoc.images[1].id,
                };

                // Only add new files if user uploaded them
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

    const handleDeleteCitizenDoc = async () => {
        if (!citizenDoc?.id) return;
        
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this Citizen ID? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDocument(citizenDoc.id);
                            Alert.alert('Success', 'Citizen ID deleted successfully');
                            
                            setCitizenDoc(undefined);
                            setCitizenIdNumber('');
                            setCitizenIssueDate('');
                            setCitizenExpiryDate('');
                            setCitizenAuthority('');
                            setCitizenFrontImage(undefined);
                            setCitizenBackImage(undefined);
                            
                            await refresh();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete document');
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteLicenseDoc = async () => {
        if (!licenseDoc?.id) return;
        
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this Driver\'s License? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDocument(licenseDoc.id);
                            Alert.alert('Success', 'Driver\'s License deleted successfully');
                            
                            setLicenseDoc(undefined);
                            setLicenseNumber('');
                            setLicenseClass('');
                            setLicenseIssueDate('');
                            setLicenseExpiryDate('');
                            setLicenseAuthority('');
                            setLicenseFrontImage(undefined);
                            setLicenseBackImage(undefined);
                            
                            await refresh();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete document');
                        }
                    },
                },
            ]
        );
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

    const isSaving = updateLoading || createDocLoading || updateDocLoading || deleteLoading;
    
    // Convert dateOfBirth from DD/MM/YYYY to YYYY-MM-DD for DatePickerModal
    const getInitialDateForPicker = () => {
        if (!dateOfBirth) return undefined;
        if (dateOfBirth.includes('/')) {
            const [day, month, year] = dateOfBirth.split('/');
            return `${year}-${month}-${day}`;
        }
        return dateOfBirth;
    };

    return (
        <>
            <EditProfileTemplate
                profileImageUri={profileImageUri}
                fullName={fullName}
                email={email}
                countryCode={countryCode}
                phoneNumber={phoneNumber}
                dateOfBirth={dateOfBirth}
                address={address}
                citizenId={citizenIdNumber}
                citizenIdAutoFill={citizenAutoFill}
                existingCitizenDoc={citizenDoc}
                citizenFrontImage={citizenFrontImage}
                citizenBackImage={citizenBackImage}
                citizenIssueDate={citizenIssueDate}
                citizenExpiryDate={citizenExpiryDate}
                citizenAuthority={citizenAuthority}
                citizenOCRProcessing={citizenOCRProcessing}
                licenseNumber={licenseNumber}
                licenseClass={licenseClass}
                licenseExpiry={licenseExpiryDate}
                licenseAutoFill={licenseAutoFill}
                existingLicenseDoc={licenseDoc}
                licenseFrontImage={licenseFrontImage}
                licenseBackImage={licenseBackImage}
                licenseIssueDate={licenseIssueDate}
                licenseAuthority={licenseAuthority}
                licenseOCRProcessing={licenseOCRProcessing}
                onBack={() => navigation.goBack()}
                onSave={handleSave}
                onCancel={() => navigation.goBack()}
                onChangePhoto={pickImage}
                onFullNameChange={setFullName}
                onEmailChange={setEmail}
                onCountryCodePress={() => {}}
                onPhoneNumberChange={setPhoneNumber}
                onDatePress={handleDateOfBirthPress}
                onAddressChange={setAddress}
                onCitizenIdChange={setCitizenIdNumber}
                onCitizenIdAutoFillChange={setCitizenAutoFill}
                onCitizenIdUpload={handleCitizenUpload}
                onCitizenIdUpdate={handleCitizenDocumentSubmit}
                onViewCitizenDoc={() => citizenDoc?.images?.[0]?.fileUrl && handleViewDocument(
                    citizenDoc.images[0].fileUrl
                )}
                onDeleteCitizenDoc={citizenDoc ? handleDeleteCitizenDoc : undefined}
                onCitizenIssueDatePress={handleCitizenIssueDatePress}
                onCitizenExpiryDatePress={handleCitizenExpiryDatePress}
                onCitizenAuthorityChange={setCitizenAuthority}
                onLicenseNumberChange={setLicenseNumber}
                onLicenseClassChange={setLicenseClass}
                onLicenseExpiryPress={handleLicenseExpiryDatePress}
                onLicenseAutoFillChange={setLicenseAutoFill}
                onLicenseUpload={handleLicenseUpload}
                onLicenseUpdate={handleLicenseDocumentSubmit}
                onViewLicenseDoc={() => licenseDoc?.images?.[0]?.fileUrl && handleViewDocument(
                    licenseDoc.images[0].fileUrl
                )}
                onDeleteLicenseDoc={licenseDoc ? handleDeleteLicenseDoc : undefined}
                onLicenseIssueDatePress={handleLicenseIssueDatePress}
                onLicenseAuthorityChange={setLicenseAuthority}
                onChangePassword={() => {}}
                saving={isSaving}
            />
            
            <DatePickerModal
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onConfirm={handleDateOfBirthConfirm}
                initialDate={getInitialDateForPicker()}
                title="Select Date of Birth"
            />
        </>
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