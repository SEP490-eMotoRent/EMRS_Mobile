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
        <Text style={styles.title}>Incident Location *</Text>
        <Text style={styles.hint}>Auto-populated from GPS. Edit if needed.</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Enter location (e.g., District 7, Ho Chi Minh City)"
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
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