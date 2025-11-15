import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from '../atoms/Text';

interface DocumentUploadPlaceholderProps {
    onUpload: (method: 'camera' | 'gallery') => void;
}

export const DocumentUploadPlaceholder: React.FC<DocumentUploadPlaceholderProps> = ({ 
    onUpload 
    }) => {
    const showOptions = () => {
    Alert.alert(
        'Tải Lên Giấy Tờ',
        'Chọn một tùy chọn',
        [
            { text: 'Chụp Ảnh', onPress: () => onUpload('camera') },
            { text: 'Chọn Từ Thư Viện', onPress: () => onUpload('gallery') },
            { text: 'Hủy', style: 'cancel' },
        ]
    );
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.placeholder} onPress={showOptions}>
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.text}>Nhấn để tải lên</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.placeholder} onPress={showOptions}>
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.text}>Nhấn để tải lên</Text>
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
    icon: {
        fontSize: 32,
    },
    text: {
        color: '#666666',
        fontSize: 12,
    },
});
