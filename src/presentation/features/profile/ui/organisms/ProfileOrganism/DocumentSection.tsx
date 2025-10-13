import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icons/Icons';
import { Button } from '../../atoms/Button';
import { Switch } from 'react-native';
import { DocumentUploadPlaceholder } from '../../molecules/DocumentUploadPlaceholder';
import { TextInput } from '../../molecules/TextInput';


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
    }) => {
    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.titleContainer}>
            <Icon name={iconName} size={20} color="#FFD700" />
            <Text variant="body" style={styles.title}>{title}</Text>
            </View>
            <Button onPress={onUpdate} style={styles.updateButton} variant="ghost">
            <Text style={styles.updateText}>Update</Text>
            </Button>
        </View>

        <TextInput
            label={`${title === "Citizen ID (CCCD)" ? "Citizen ID" : "License"} Number*`}
            value={documentNumber}
            onChangeText={onDocumentNumberChange}
            placeholder="Enter number"
        />

        {additionalFields}

        <Text variant="label" style={styles.uploadLabel}>
            Upload {title === "Citizen ID (CCCD)" ? "CCCD" : "License"} Images
        </Text>
        <DocumentUploadPlaceholder onUpload={onUpload} />

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
    updateButton: {
        padding: 0,
    },
    updateText: {
        color: '#7C3AED',
        fontSize: 14,
    },
    uploadLabel: {
        marginTop: 8,
        marginBottom: 4,
    },
    autoFillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
});