import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface PhotosDocumentationSectionProps {
    photos: File[];
    onAddPhoto: (file: File) => void;
    onRemovePhoto: (index: number) => void;
    maxPhotos?: number;
}

export const PhotosDocumentationSection: React.FC<PhotosDocumentationSectionProps> = ({
    photos,
    onAddPhoto,
    onRemovePhoto,
    maxPhotos = 4,
}) => {
    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to take photos!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            // Convert to File object
            const response = await fetch(uri);
            const blob = await response.blob();
            const file = new File([blob], `incident_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onAddPhoto(file);
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need gallery permissions to pick photos!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            const response = await fetch(uri);
            const blob = await response.blob();
            const file = new File([blob], `incident_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onAddPhoto(file);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Text style={styles.title}>Photos Documentation</Text>
                <TouchableOpacity onPress={handleTakePhoto} style={styles.headerRight}>
                    <Text style={styles.icon}>📷</Text>
                    <Text style={styles.headerAction}>Take Photo</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.hint}>
                Upload up to {maxPhotos} photos of the incident ({photos.length}/{maxPhotos})
            </Text>
            <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                    <View key={index} style={styles.photoCard}>
                        <Image 
                            source={{ uri: URL.createObjectURL(photo) }} 
                            style={styles.photoImage}
                        />
                        <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => onRemovePhoto(index)}
                        >
                            <Text style={styles.removeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {photos.length < maxPhotos && (
                    <TouchableOpacity 
                        style={styles.addPhotoCard}
                        onPress={handlePickImage}
                    >
                        <Text style={styles.addIcon}>+</Text>
                        <Text style={styles.addText}>Add Photo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    icon: {
        fontSize: 18,
    },
    headerAction: {
        fontSize: 14,
        color: '#fff',
    },
    hint: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photoCard: {
        width: 80,
        height: 80,
        borderRadius: 8,
        position: 'relative',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FF4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeIcon: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    addPhotoCard: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
    },
    addIcon: {
        fontSize: 24,
        color: '#666',
    },
    addText: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
});