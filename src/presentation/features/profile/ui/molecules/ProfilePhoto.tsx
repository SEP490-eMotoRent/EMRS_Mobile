import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icons/Icons';

interface ProfilePhotoProps {
    imageUri?: string;
    onPress: () => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageUri, onPress }) => {
    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.photoContainer} onPress={onPress}>
            {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} />
            ) : (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>👤</Text>
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