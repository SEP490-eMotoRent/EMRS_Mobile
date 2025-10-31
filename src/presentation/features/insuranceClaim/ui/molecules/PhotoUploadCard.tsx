import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface PhotoUploadCardProps {
    onPress: () => void;
    hasPhoto?: boolean;
}

export const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({ onPress, hasPhoto }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <Text style={styles.icon}>{hasPhoto ? '🖼️' : '📷'}</Text>
        <Text style={styles.text}>Add Photo</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 32,
    },
    text: {
        fontSize: 12,
        color: '#999',
    },
});
