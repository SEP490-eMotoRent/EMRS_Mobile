import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export interface LocationInputSectionProps {
    value: string;
    onChangeText: (text: string) => void;
    onGpsPress?: () => void;
    error?: string;
}

export const LocationInputSection: React.FC<LocationInputSectionProps> = ({ 
    value,
    onChangeText,
    onGpsPress,
    error,
}) => (
    <View style={styles.section}>
        <Text style={styles.title}>Incident Location *</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Enter location (e.g., District 7, Ho Chi Minh City)"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
            />
            {onGpsPress && (
                <TouchableOpacity style={styles.gpsButton} onPress={onGpsPress}>
                    <Text style={styles.gpsIcon}>📍</Text>
                </TouchableOpacity>
            )}
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
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 14,
        color: '#fff',
    },
    gpsButton: {
        padding: 12,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gpsIcon: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 12,
        color: '#FF4444',
        marginTop: 8,
    },
});