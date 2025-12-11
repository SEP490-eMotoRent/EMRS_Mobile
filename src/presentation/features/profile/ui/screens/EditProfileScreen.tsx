import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { useCreateDocument } from '../../hooks/documents/useCreateDocument';
import { useDeleteDocument } from '../../hooks/documents/useDeleteDocument';
import { useDocumentOCR } from '../../hooks/documents/useDocumentOCR';
import { useUpdateDocument } from '../../hooks/documents/useUpdateDocument';
import { useRenterProfile } from '../../hooks/profile/useRenterProfile';
import { useUpdateRenterProfile } from '../../hooks/profile/useUpdateRenterProfile';
import { DatePickerModal } from '../organisms/DatePickerModal';
import { EditProfileTemplate } from '../templates/EditProfileTemplate';

const normalizeUri = (uri: string | string[] | undefined): string | undefined => {
  if (!uri) return undefined;
  if (Array.isArray(uri)) return typeof uri[0] === 'string' ? uri[0] : undefined;
  return typeof uri === 'string' ? uri : undefined;
};

const convertDisplayToISO = (displayDate: string): string | undefined => {
  if (!displayDate?.trim() || !displayDate.includes('/')) return undefined;
  const [day, month, year] = displayDate.split('/');
  if (!day || !month || !year) return undefined;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const convertISOToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    if (isoDate.includes('/')) return isoDate;
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

export const EditProfileScreen = ({ navigation }: any) => {
    const {
        renter,
        renterResponse,
        avatarMediaId,
        loading: fetchLoading,
        refresh,
    } = useRenterProfile();

    const { update, loading: updateLoading } = useUpdateRenterProfile();

    const { createCitizen, createDriving, loading: createDocLoading } = useCreateDocument();
    const { updateCitizen, updateDriving, loading: updateDocLoading } = useUpdateDocument();
    const { deleteDocument, loading: deleteLoading } = useDeleteDocument();
    const { processCitizenID, processDriverLicense } = useDocumentOCR();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [profileImageUri, setProfileImageUri] = useState<string | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Document state
    const [citizenDoc, setCitizenDoc] = useState<DocumentResponse | undefined>();
    const [licenseDoc, setLicenseDoc] = useState<DocumentResponse | undefined>();

    const [citizenFrontImage, setCitizenFrontImage] = useState<string | undefined>();
    const [citizenBackImage, setCitizenBackImage] = useState<string | undefined>();
    const [licenseFrontImage, setLicenseFrontImage] = useState<string | undefined>();
    const [licenseBackImage, setLicenseBackImage] = useState<string | undefined>();

    const [citizenIdNumber, setCitizenIdNumber] = useState('');
    const [citizenIssueDate, setCitizenIssueDate] = useState('');
    const [citizenExpiryDate, setCitizenExpiryDate] = useState('');
    const [citizenAuthority, setCitizenAuthority] = useState('');

    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseClass, setLicenseClass] = useState('');
    const [licenseIssueDate, setLicenseIssueDate] = useState('');
    const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
    const [licenseAuthority, setLicenseAuthority] = useState('');

    const [citizenAutoFill, setCitizenAutoFill] = useState(true);
    const [licenseAutoFill, setLicenseAutoFill] = useState(true);

    const [citizenOCRProcessing, setCitizenOCRProcessing] = useState(false);
    const [licenseOCRProcessing, setLicenseOCRProcessing] = useState(false);

    // Fill form on load
    useEffect(() => {
        if (!renter || !renterResponse) return;

        setFullName(renter.account?.fullname || '');
        setEmail(renter.email || '');
        setAddress(renter.address || '');
        setDateOfBirth(renterResponse.dateOfBirth || '');

        // Phone: remove +84 if exists
        let phone = renter.phone || '';
        if (phone.startsWith('+84')) phone = phone.substring(3);
        else if (phone.startsWith('84')) phone = phone.substring(2);
        setPhoneNumber(phone.replace(/\D/g, ''));

        // Avatar: use new object format
        const avatarUrl = renterResponse.avatar?.fileUrl;
        setProfileImageUri(avatarUrl || undefined);

        // Documents
        const citizenDocument = renterResponse.documents.find(d => d.documentType === 'Citizen');
        const licenseDocument = renterResponse.documents.find(d =>
        ['Driving', 'License', 'DriverLicense'].includes(d.documentType)
        );

        setCitizenDoc(citizenDocument);
        setLicenseDoc(licenseDocument);

        if (citizenDocument) {
        setCitizenIdNumber(citizenDocument.documentNumber || '');
        setCitizenIssueDate(convertISOToDisplay(citizenDocument.issueDate || ''));
        setCitizenExpiryDate(convertISOToDisplay(citizenDocument.expiryDate || ''));
        setCitizenAuthority(citizenDocument.issuingAuthority || '');
        }

        if (licenseDocument) {
        setLicenseNumber(licenseDocument.documentNumber || '');
        setLicenseIssueDate(convertISOToDisplay(licenseDocument.issueDate || ''));
        setLicenseExpiryDate(convertISOToDisplay(licenseDocument.expiryDate || ''));
        setLicenseAuthority(licenseDocument.issuingAuthority || '');
        }
    }, [renter, renterResponse]);

    // OCR effects (unchanged)
    useEffect(() => {
        const run = async () => {
        if (!citizenAutoFill || !citizenFrontImage || !citizenBackImage || citizenDoc) return;
        setCitizenOCRProcessing(true);
        try {
            const result = await processCitizenID(citizenFrontImage, citizenBackImage);
            result?.documentNumber && setCitizenIdNumber(result.documentNumber);
            result?.issueDate && setCitizenIssueDate(result.issueDate);
            result?.expiryDate && setCitizenExpiryDate(result.expiryDate);
            result?.authority && setCitizenAuthority(result.authority);
        } catch (e) { console.error(e); }
        finally { setCitizenOCRProcessing(false); }
        };
        run();
    }, [citizenFrontImage, citizenBackImage, citizenAutoFill, citizenDoc]);

    useEffect(() => {
        const run = async () => {
        if (!licenseAutoFill || !licenseFrontImage || !licenseBackImage || licenseDoc) return;
        setLicenseOCRProcessing(true);
        try {
            const result = await processDriverLicense(licenseFrontImage, licenseBackImage);
            result?.documentNumber && setLicenseNumber(result.documentNumber);
            result?.issueDate && setLicenseIssueDate(result.issueDate);
            result?.expiryDate && setLicenseExpiryDate(result.expiryDate);
            result?.authority && setLicenseAuthority(result.authority);
            result?.licenseClass && setLicenseClass(result.licenseClass);
        } catch (e) { console.error(e); }
        finally { setLicenseOCRProcessing(false); }
        };
        run();
    }, [licenseFrontImage, licenseBackImage, licenseAutoFill, licenseDoc]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]) {
        const uri = normalizeUri(result.assets[0].uri);
        uri && setProfileImageUri(uri);
        }
    };

    const handleDateOfBirthPress = () => setShowDatePicker(true);
    const handleDateOfBirthConfirm = (date: string) => setDateOfBirth(date);

    // Document upload functions (your existing ones — keep them as-is)
    const handleCitizenUpload = (method: 'camera' | 'gallery') => { /* your code */ };
    const pickCitizenFromGallery = async () => { /* your code */ };
    const handleLicenseUpload = (method: 'camera' | 'gallery') => { /* your code */ };
    const pickLicenseFromGallery = async () => { /* your code */ };
    const handleCitizenDocumentSubmit = async () => { /* your code */ };
    const handleLicenseDocumentSubmit = async () => { /* your code */ };
    const handleDeleteCitizenDoc = async () => { /* your code */ };
    const handleDeleteLicenseDoc = async () => { /* your code */ };

    // FINAL SAVE — FIXED TO WORK WITH CURRENT BACKEND
    const handleSave = async () => {
        try {
        if (!email || !phoneNumber || !address) {
            Alert.alert('Lỗi', 'Email, số điện thoại và địa chỉ là bắt buộc');
            return;
        }

        let formattedDate = dateOfBirth;
        if (dateOfBirth?.includes('/')) {
            const [d, m, y] = dateOfBirth.split('/');
            formattedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }

        const request: any = {
            Email: email.trim(),
            phone: phoneNumber.startsWith('0')
            ? `+84${phoneNumber.substring(1)}`
            : `+84${phoneNumber}`,
            Address: address.trim(),
            DateOfBirth: formattedDate || undefined,
            Fullname: fullName.trim() || undefined,
        };

        // SEND MediaId IF WE HAVE ONE (this prevents duplicates!)
        if (avatarMediaId) {
            request.MediaId = avatarMediaId;
        }

        // Only send file if user picked a new image
        if (profileImageUri && !profileImageUri.startsWith('http')) {
            request.ProfilePicture = {
            uri: profileImageUri,
            name: 'profile.jpg',
            type: 'image/jpeg',
            };
        }

        const response = await update(request);

        // Backend now returns ProfilePicture (string URL)
        if (response.ProfilePicture) {
            setProfileImageUri(response.ProfilePicture);
        }

        await refresh();
        Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
        navigation.goBack();
        } catch (err: any) {
        console.error('Update failed:', err);
        Alert.alert('Lỗi', err.message || 'Không thể cập nhật hồ sơ');
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

    const getInitialDateForPicker = () => {
        if (!dateOfBirth) return undefined;
        if (dateOfBirth.includes('/')) {
        const [d, m, y] = dateOfBirth.split('/');
        return `${y}-${m}-${d}`;
        }
        return dateOfBirth;
    };

    return (
        <>
        <EditProfileTemplate
            profileImageUri={profileImageUri}
            fullName={fullName}
            email={email}
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
            onPhoneNumberChange={setPhoneNumber}
            onDatePress={handleDateOfBirthPress}
            onAddressChange={setAddress}
            onCitizenIdChange={setCitizenIdNumber}
            onCitizenIdAutoFillChange={setCitizenAutoFill}
            onCitizenIdUpload={handleCitizenUpload}
            onCitizenIdUpdate={handleCitizenDocumentSubmit}
            onDeleteCitizenDoc={citizenDoc ? handleDeleteCitizenDoc : undefined}
            onCitizenIssueDatePress={() => Alert.alert('Sắp ra mắt')}
            onCitizenExpiryDatePress={() => Alert.alert('Sắp ra mắt')}
            onCitizenAuthorityChange={setCitizenAuthority}
            onLicenseNumberChange={setLicenseNumber}
            onLicenseClassChange={setLicenseClass}
            onLicenseExpiryPress={() => Alert.alert('Sắp ra mắt')}
            onLicenseAutoFillChange={setLicenseAutoFill}
            onLicenseUpload={handleLicenseUpload}
            onLicenseUpdate={handleLicenseDocumentSubmit}
            onDeleteLicenseDoc={licenseDoc ? handleDeleteLicenseDoc : undefined}
            onLicenseIssueDatePress={() => Alert.alert('Sắp ra mắt')}
            onLicenseAuthorityChange={setLicenseAuthority}
            onChangePassword={() => navigation.navigate('ChangePassword')}
            saving={isSaving}
        />

        <DatePickerModal
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onConfirm={handleDateOfBirthConfirm}
            initialDate={getInitialDateForPicker()}
            title="Chọn ngày sinh"
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