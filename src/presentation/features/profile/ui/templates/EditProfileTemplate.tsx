import React from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icons/Icons';
import { Text } from '../atoms/Text';
import { DateInput } from '../molecules/DateInput';
import { ProfilePhoto } from '../molecules/ProfilePhoto';
import { TextInput } from '../molecules/TextInput';
import { DocumentSection } from '../organisms/ProfileOrganism/DocumentSection';
import { PersonalInfoSection } from '../organisms/ProfileOrganism/PersonalInfoSection';
import { DocumentResponse } from '../../../../../data/models/account/renter/RenterResponse';

// Helper: Normalize URI (handles string | string[] | undefined)
const normalizeImageUri = (uri: string | string[] | undefined): string | undefined => {
    if (!uri) return undefined;
    if (Array.isArray(uri)) {
        return uri[0] || undefined;
    }
    return uri;
};

interface EditProfileTemplateProps {
    profileImageUri?: string | string[]; // ← Accept array
    fullName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    citizenId: string;
    citizenIdAutoFill: boolean;
    existingCitizenDoc?: DocumentResponse;
    licenseNumber: string;
    licenseClass: string;
    licenseExpiry: string;
    licenseAutoFill: boolean;
    existingLicenseDoc?: DocumentResponse;
    onBack: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChangePhoto: () => void;
    onFullNameChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onCountryCodePress: () => void;
    onPhoneNumberChange: (text: string) => void;
    onDatePress: () => void;
    onAddressChange: (text: string) => void;
    onCitizenIdChange: (text: string) => void;
    onCitizenIdAutoFillChange: (value: boolean) => void;
    onCitizenIdUpload: (method: 'camera' | 'gallery') => void;
    onCitizenIdUpdate: () => void;
    onViewCitizenDoc?: () => void;
    onLicenseNumberChange: (text: string) => void;
    onLicenseClassChange: (text: string) => void;
    onLicenseExpiryPress: () => void;
    onLicenseAutoFillChange: (value: boolean) => void;
    onLicenseUpload: (method: 'camera' | 'gallery') => void;
    onLicenseUpdate: () => void;
    onViewLicenseDoc?: () => void;
    onChangePassword: () => void;
    saving?: boolean;
}

export const EditProfileTemplate: React.FC<EditProfileTemplateProps> = (props) => {
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
            <Text variant="header">Edit Profile</Text>
            <Button
                onPress={props.saving ? undefined : props.onSave}
                style={styles.saveButton}
                variant="ghost"
            >
                {props.saving ? (
                <ActivityIndicator size="small" color="#7C3AED" />
                ) : (
                <Text style={styles.saveText}>Save</Text>
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
                countryCode={props.countryCode}
                phoneNumber={props.phoneNumber}
                dateOfBirth={props.dateOfBirth}
                address={props.address}
                onFullNameChange={props.onFullNameChange}
                onEmailChange={props.onEmailChange}
                onCountryCodePress={props.onCountryCodePress}
                onPhoneNumberChange={props.onPhoneNumberChange}
                onDatePress={props.onDatePress}
                onAddressChange={props.onAddressChange}
            />

            {/* Identity Documents Section */}
            <Text variant="title" style={styles.sectionTitle}>
                Identity Documents
            </Text>

            {/* Citizen ID */}
            <DocumentSection
                title="Citizen ID (CCCD)"
                iconName="id"
                documentNumber={props.citizenId}
                onDocumentNumberChange={props.onCitizenIdChange}
                autoFill={props.citizenIdAutoFill}
                onAutoFillChange={props.onCitizenIdAutoFillChange}
                onUpload={props.onCitizenIdUpload}
                onUpdate={props.onCitizenIdUpdate}
                existingDocument={props.existingCitizenDoc}
                onViewDocument={props.onViewCitizenDoc}
            />

            {/* Driver's License */}
            <DocumentSection
                title="Driver's License"
                iconName="license"
                documentNumber={props.licenseNumber}
                onDocumentNumberChange={props.onLicenseNumberChange}
                autoFill={props.licenseAutoFill}
                onAutoFillChange={props.onLicenseAutoFillChange}
                onUpload={props.onLicenseUpload}
                onUpdate={props.onLicenseUpdate}
                existingDocument={props.existingLicenseDoc}
                onViewDocument={props.onViewLicenseDoc}
                additionalFields={
                <>
                    <TextInput
                    label="License Class*"
                    value={props.licenseClass}
                    onChangeText={props.onLicenseClassChange}
                    placeholder="Enter license class"
                    />
                    <DateInput
                    label="Expiry Date*"
                    value={props.licenseExpiry}
                    onPress={props.onLicenseExpiryPress}
                    />
                </>
                }
            />

            {/* Security Section */}
            <Text variant="title" style={styles.sectionTitle}>
                Security
            </Text>
            <Button
                onPress={props.onChangePassword}
                style={styles.securityButton}
                variant="secondary"
            >
                <View style={styles.securityButtonContent}>
                <View style={styles.securityButtonLeft}>
                    <Icon name="lock" size={20} />
                    <Text>Change Password</Text>
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
                <Text style={styles.saveChangesText}>Save Changes</Text>
                )}
            </Button>

            <Button onPress={props.onCancel} style={styles.cancelButton} variant="ghost">
                <Text style={styles.cancelText}>Cancel</Text>
            </Button>

            <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
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
});