import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icons/Icons';
import { Text } from '../atoms/Text';
import { ProfilePhoto } from '../molecules/ProfilePhoto';
import { PersonalInfoSection } from '../organisms/ProfileOrganism/PersonalInfoSection';

// Helper: Normalize URI (handles string | string[] | undefined)
const normalizeImageUri = (uri: string | string[] | undefined): string | undefined => {
    if (!uri) return undefined;
    if (Array.isArray(uri)) {
        return uri[0] || undefined;
    }
    return uri;
};

interface EditProfileTemplateProps {
    profileImageUri?: string | string[];
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    
    // Citizen ID props
    citizenId: string;
    citizenIdAutoFill: boolean;
    existingCitizenDoc?: DocumentResponse;
    citizenFrontImage?: string;
    citizenBackImage?: string;
    citizenIssueDate?: string;
    citizenExpiryDate?: string;
    citizenAuthority?: string;
    citizenOCRProcessing?: boolean;
    
    // License props
    licenseNumber: string;
    licenseClass: string;
    licenseExpiry: string;
    licenseAutoFill: boolean;
    existingLicenseDoc?: DocumentResponse;
    licenseFrontImage?: string;
    licenseBackImage?: string;
    licenseIssueDate?: string;
    licenseAuthority?: string;
    licenseOCRProcessing?: boolean;
    
    // Handlers
    onBack: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChangePhoto: () => void;
    onFullNameChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onPhoneNumberChange: (text: string) => void;
    onDatePress: () => void;
    onAddressChange: (text: string) => void;
    onCitizenIdChange: (text: string) => void;
    onCitizenIdAutoFillChange: (value: boolean) => void;
    onCitizenIdUpload: (method: 'camera' | 'gallery') => void;
    onCitizenIdUpdate: () => void;
    onDeleteCitizenDoc?: () => void;
    onCitizenIssueDatePress?: () => void;
    onCitizenExpiryDatePress?: () => void;
    onCitizenAuthorityChange?: (text: string) => void;
    onLicenseNumberChange: (text: string) => void;
    onLicenseClassChange: (text: string) => void;
    onLicenseExpiryPress: () => void;
    onLicenseAutoFillChange: (value: boolean) => void;
    onLicenseUpload: (method: 'camera' | 'gallery') => void;
    onLicenseUpdate: () => void;
    onDeleteLicenseDoc?: () => void;
    onLicenseIssueDatePress?: () => void;
    onLicenseAuthorityChange?: (text: string) => void;
    onChangePassword: () => void;
    saving?: boolean;
}

const { width, height } = Dimensions.get('window');

export const EditProfileTemplate: React.FC<EditProfileTemplateProps> = (props) => {
    // ✅ Add state for image viewer modal
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    // Normalize image URI safely for ProfilePhoto
    const safeImageUri = normalizeImageUri(props.profileImageUri);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Button onPress={props.onBack} style={styles.backButton} variant="ghost">
                        <Icon name="back" size={24} />
                    </Button>
                    <Text variant="header">Chỉnh sửa hồ sơ</Text>
                    <Button
                        onPress={props.saving ? undefined : props.onSave}
                        style={styles.saveButton}
                        variant="ghost"
                    >
                        {props.saving ? (
                            <ActivityIndicator size="small" color="#7C3AED" />
                        ) : (
                            <Text style={styles.saveText}>Lưu</Text>
                        )}
                    </Button>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Profile Photo */}
                    <ProfilePhoto 
                        imageUri={safeImageUri} 
                        onPress={props.onChangePhoto} 
                    />

                    {/* Personal Information */}
                    <PersonalInfoSection
                        fullName={props.fullName}
                        email={props.email}
                        phoneNumber={props.phoneNumber}
                        dateOfBirth={props.dateOfBirth}
                        address={props.address}
                        onFullNameChange={props.onFullNameChange}
                        onEmailChange={props.onEmailChange}
                        onPhoneNumberChange={props.onPhoneNumberChange}
                        onDatePress={props.onDatePress}
                        onAddressChange={props.onAddressChange}
                    />

                    {/* ❌ REMOVED: Duplicate section title */}
                    {/* <Text variant="title" style={styles.sectionTitle}>
                        Căn Cước Công Dân
                    </Text> */}

                    {/* Citizen ID */}
                    {/* <DocumentSection
                        title="Căn Cước Công Dân (CCCD)"
                        iconName="id"
                        documentNumber={props.citizenId}
                        onDocumentNumberChange={props.onCitizenIdChange}
                        autoFill={props.citizenIdAutoFill}
                        onAutoFillChange={props.onCitizenIdAutoFillChange}
                        onUpload={props.onCitizenIdUpload}
                        onUpdate={props.onCitizenIdUpdate}
                        existingDocument={props.existingCitizenDoc}
                        onViewDocument={(imageUrl) => setViewingImage(imageUrl)}
                        onDeleteDocument={props.onDeleteCitizenDoc}
                        frontImage={props.citizenFrontImage}
                        backImage={props.citizenBackImage}
                        issueDate={props.citizenIssueDate}
                        expiryDate={props.citizenExpiryDate}
                        issuingAuthority={props.citizenAuthority}
                        onIssueDatePress={props.onCitizenIssueDatePress}
                        onExpiryDatePress={props.onCitizenExpiryDatePress}
                        onIssuingAuthorityChange={props.onCitizenAuthorityChange}
                        ocrProcessing={props.citizenOCRProcessing}
                    /> */}

                    {/* Driver's License */}
                    {/* <DocumentSection
                        title="Giấy Phép Lái Xe"
                        iconName="license"
                        documentNumber={props.licenseNumber}
                        onDocumentNumberChange={props.onLicenseNumberChange}
                        autoFill={props.licenseAutoFill}
                        onAutoFillChange={props.onLicenseAutoFillChange}
                        onUpload={props.onLicenseUpload}
                        onUpdate={props.onLicenseUpdate}
                        existingDocument={props.existingLicenseDoc}
                        onViewDocument={(imageUrl) => setViewingImage(imageUrl)}
                        onDeleteDocument={props.onDeleteLicenseDoc}
                        frontImage={props.licenseFrontImage}
                        backImage={props.licenseBackImage}
                        issueDate={props.licenseIssueDate}
                        expiryDate={props.licenseExpiry}
                        issuingAuthority={props.licenseAuthority}
                        onIssueDatePress={props.onLicenseIssueDatePress}
                        onExpiryDatePress={props.onLicenseExpiryPress}
                        onIssuingAuthorityChange={props.onLicenseAuthorityChange}
                        ocrProcessing={props.licenseOCRProcessing}
                        additionalFields={
                            <>
                                <TextInput
                                    label="Hạng Bằng*"
                                    value={props.licenseClass}
                                    onChangeText={props.onLicenseClassChange}
                                    placeholder="Nhập hạng bằng"
                                />
                            </>
                        }
                    /> */}

                    {/* Security Section */}
                    <Text variant="title" style={styles.sectionTitle}>
                        Bảo Mật
                    </Text>
                    <Button
                        onPress={props.onChangePassword}
                        style={styles.securityButton}
                        variant="secondary"
                    >
                        <View style={styles.securityButtonContent}>
                            <View style={styles.securityButtonLeft}>
                                <Icon name="lock" size={20} />
                                <Text>Đổi Mật Khẩu</Text>
                            </View>
                            <Icon name="chevron" size={20} color="#666666" />
                        </View>
                    </Button>

                    {/* Action Buttons */}
                    <Button
                        onPress={props.saving ? undefined : props.onSave}
                        style={[styles.saveChangesButton, props.saving && { opacity: 0.6 }]}
                        disabled={props.saving}
                    >
                        {props.saving ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.saveChangesText}>Lưu Thay Đổi</Text>
                        )}
                    </Button>

                    <Button onPress={props.onCancel} style={styles.cancelButton} variant="ghost">
                        <Text style={styles.cancelText}>Hủy</Text>
                    </Button>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </View>

            {/* ✅ Image Viewer Modal */}
            <Modal
                visible={!!viewingImage}
                transparent
                animationType="fade"
                onRequestClose={() => setViewingImage(null)}
                statusBarTranslucent
            >
                <TouchableWithoutFeedback onPress={() => setViewingImage(null)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: viewingImage || '' }}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableWithoutFeedback>

                        {/* Close button */}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => setViewingImage(null)}
                        >
                            <Icon name="close" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    backButton: {
        padding: 8,
    },
    saveButton: {
        padding: 8,
    },
    saveText: {
        color: '#7C3AED',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        marginTop: 8,
        marginBottom: 16,
    },
    securityButton: {
        marginBottom: 24,
    },
    securityButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    securityButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    saveChangesButton: {
        marginTop: 16,
        marginBottom: 12,
    },
    saveChangesText: {
        color: '#000000',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButton: {
        marginBottom: 24,
    },
    cancelText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    bottomPadding: {
        height: 40,
    },
    // ✅ Image Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});