import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icons/Icons';
import { Button } from '../../atoms/Button';
import { Switch } from 'react-native';
import { DocumentUploadPlaceholder } from '../../molecules/DocumentUploadPlaceholder';
import { TextInput } from '../../molecules/TextInput';

interface DocumentData {
    id: string;
    documentNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
    verificationStatus: string;
    fileUrl: string;
}

interface DocumentSectionProps {
    title: string;
    iconName: 'id' | 'license';
    documentNumber: string;
    onDocumentNumberChange: (text: string) => void;
    autoFill: boolean;
    onAutoFillChange: (value: boolean) => void;
    onUpload: (method: 'camera' | 'gallery') => void;
    onUpdate: () => void;
    additionalFields?: React.ReactNode;
    // NEW: Existing document data
    existingDocument?: DocumentData;
    onViewDocument?: () => void;
}

export const DocumentSection: React.FC<DocumentSectionProps> = ({
    title,
    iconName,
    documentNumber,
    onDocumentNumberChange,
    autoFill,
    onAutoFillChange,
    onUpload,
    onUpdate,
    additionalFields,
    existingDocument,
    onViewDocument,
}) => {
    const hasDocument = !!existingDocument;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Icon name={iconName} size={20} color="#FFD700" />
                    <Text variant="body" style={styles.title}>{title}</Text>
                    {hasDocument && existingDocument.verificationStatus && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="check" size={12} color="#10B981" />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    )}
                </View>
                <Button onPress={onUpdate} style={styles.updateButton} variant="ghost">
                    <Text style={styles.updateText}>Update</Text>
                </Button>
            </View>

            <View style={hasDocument ? styles.disabledInput : undefined}>
                <TextInput
                    label={`${title === "Citizen ID (CCCD)" ? "Citizen ID" : "License"} Number*`}
                    value={documentNumber}
                    onChangeText={onDocumentNumberChange}
                    placeholder="Enter number"
                />
            </View>

            {/* Show additional info if document exists */}
            {hasDocument && (
                <View style={styles.documentInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Issue Date:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(existingDocument.issueDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Expiry Date:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(existingDocument.expiryDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Issuing Authority:</Text>
                        <Text style={styles.infoValue}>
                            {existingDocument.issuingAuthority}
                        </Text>
                    </View>
                </View>
            )}

            {additionalFields}

            <Text variant="label" style={styles.uploadLabel}>
                {hasDocument ? 'Document Image' : `Upload ${title === "Citizen ID (CCCD)" ? "CCCD" : "License"} Images`}
            </Text>

            {/* Show existing document image or upload placeholder */}
            {hasDocument && existingDocument.fileUrl ? (
                <TouchableOpacity 
                    style={styles.documentImageContainer}
                    onPress={onViewDocument}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: existingDocument.fileUrl }}
                        style={styles.documentImage}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                        <Icon name="document" size={24} color="#FFF" />
                        <Text style={styles.overlayText}>Tap to view full image</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <DocumentUploadPlaceholder onUpload={onUpload} />
            )}

            <View style={styles.autoFillContainer}>
                <Text>Auto-fill from document</Text>
                <Switch value={autoFill} onValueChange={onAutoFillChange} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontWeight: '500',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B98120',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    verifiedText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '600',
    },
    updateButton: {
        padding: 0,
    },
    updateText: {
        color: '#7C3AED',
        fontSize: 14,
    },
    documentInfo: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        gap: 6,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    uploadLabel: {
        marginTop: 8,
        marginBottom: 4,
    },
    documentImageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        height: 200,
        marginTop: 8,
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    overlayText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },
    autoFillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    disabledInput: {
        opacity: 0.6,
        pointerEvents: 'none',
    },
});