import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icons/Icons';

interface DocumentUploadPlaceholderProps {
    onUpload: () => void;
}

export const DocumentUploadPlaceholder: React.FC<DocumentUploadPlaceholderProps> = ({ 
    onUpload 
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.placeholder} onPress={onUpload}>
                <Icon name="camera" size={32} color="#B8A4FF" />
                <Text style={styles.text}>Nhấn để tải lên</Text>
                <Text style={styles.subtext}>Mặt Trước</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeholder} onPress={onUpload}>
                <Icon name="camera" size={32} color="#B8A4FF" />
                <Text style={styles.text}>Nhấn để tải lên</Text>
                <Text style={styles.subtext}>Mặt Sau</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 12,
    },
    placeholder: {
        flex: 1,
        aspectRatio: 1.5,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2A2A2A',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    subtext: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: '500',
    },
});