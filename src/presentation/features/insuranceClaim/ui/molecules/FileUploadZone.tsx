import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface FileUploadZoneProps {
    onUpload: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUpload }) => {
    return (
        <TouchableOpacity
        style={styles.uploadZone}
        onPress={onUpload}
        activeOpacity={0.7}
        >
        <Text style={styles.uploadIcon}>↑</Text>
        <Text style={styles.uploadText}>
            Drag & drop files here or{' '}
            <Text style={styles.uploadLink}>browse</Text>
        </Text>
        <Text style={styles.uploadHint}>PDF, JPG, PNG (max 10MB)</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    uploadZone: {
        borderWidth: 2,
        borderColor: '#374151',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 32,
        alignItems: 'center',
        gap: 8,
    },
    uploadIcon: {
        fontSize: 24,
        color: '#9CA3AF',
    },
    uploadText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    uploadLink: {
        color: '#8B5CF6',
        fontWeight: '500',
    },
    uploadHint: {
        fontSize: 12,
        color: '#6B7280',
    },
});
