import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icons/Icons';

// Normalize URI: string | string[] | undefined → string | undefined
const normalizeUri = (uri: string | string[] | undefined): string | undefined => {
    if (!uri) return undefined;
    return Array.isArray(uri) ? uri[0] : uri;
};

interface ProfilePhotoProps {
    imageUri?: string | string[]; // ← NOW ACCEPTS ARRAY
    onPress: () => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageUri, onPress }) => {
    const safeUri = normalizeUri(imageUri);

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.photoContainer} onPress={onPress}>
            {safeUri ? (
            <Image source={{ uri: safeUri }} style={styles.photo} />
            ) : (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>User</Text>
            </View>
            )}
            <View style={styles.cameraIcon}>
            <Icon name="camera" size={16} />
            </View>
        </TouchableOpacity>
        <Text style={styles.label}>Change Photo</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 24,
    },
    photoContainer: {
        position: 'relative',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 48,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginTop: 8,
        color: '#FFFFFF',
    },
});