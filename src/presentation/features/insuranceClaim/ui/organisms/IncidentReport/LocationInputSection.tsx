import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export interface LocationInputSectionProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
}

export const LocationInputSection: React.FC<LocationInputSectionProps> = ({ 
    value,
    onChangeText,
    error,
}) => (
    <View style={styles.section}>
        <Text style={styles.title}>Địa điểm sự cố *</Text>
        <Text style={styles.hint}>Tự động lấy từ GPS. Chỉnh sửa nếu cần.</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Nhập địa điểm (VD: Quận 7, TP.HCM)"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    hint: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    inputContainer: {
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    input: {
        padding: 12,
        fontSize: 14,
        color: '#fff',
    },
    errorText: {
        fontSize: 12,
        color: '#FF4444',
        marginTop: 8,
    },
});