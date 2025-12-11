import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Icon } from '../../atoms/icons/Icon';

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
        <View style={styles.header}>
            <Icon name="location" size={20} color="#d4c5f9" />
            <Text style={styles.title}>Địa điểm sự cố *</Text>
        </View>
        <Text style={styles.hint}>
            <Icon name="info" size={12} color="#666" /> Tự động lấy từ GPS. Chỉnh sửa nếu cần.
        </Text>
        <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            <Icon name="edit" size={16} color="#666" />
            <TextInput
                style={styles.input}
                placeholder="Nhập địa điểm (VD: Quận 7, TP.HCM)"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                multiline
            />
        </View>
        {error && (
            <View style={styles.errorContainer}>
                <Icon name="warning" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    hint: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        lineHeight: 18,
    },
    inputContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 10,
    },
    inputContainerError: {
        borderColor: '#ef4444',
        backgroundColor: '#1a0f0f',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        padding: 0,
        minHeight: 40,
        textAlignVertical: 'top',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    errorText: {
        fontSize: 13,
        color: '#ef4444',
    },
});