import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FileUploadZone } from '../../molecules/FileUploadZone';

export interface DocumentUploadProps {
    onUpload: () => void;
    instructions: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onUpload,
    instructions,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.uploadHeader}>
                <Text style={styles.uploadTitle}>Tải lên</Text>
            </View>
            <Text style={styles.uploadInstructions}>{instructions}</Text>
            <FileUploadZone onUpload={onUpload} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    uploadHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    uploadInstructions: {
        fontSize: 13,
        color: '#9CA3AF',
        lineHeight: 18,
    },
});