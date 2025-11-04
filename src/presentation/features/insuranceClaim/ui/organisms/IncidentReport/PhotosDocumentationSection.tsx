import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TripStackParamList } from '../../../../../shared/navigation/StackParameters/types';

type NavigationProp = StackNavigationProp<TripStackParamList>;

export interface PhotosDocumentationSectionProps {
    photos: string[]; // Changed from File[] to string[] (URIs)
    onAddPhoto: (uri: string) => void;
    onRemovePhoto: (index: number) => void;
    maxPhotos?: number;
    bookingId: string;
}

export const PhotosDocumentationSection: React.FC<PhotosDocumentationSectionProps> = ({
    photos,
    onAddPhoto,
    onRemovePhoto,
    maxPhotos = 4,
    bookingId,
}) => {
    const navigation = useNavigation<NavigationProp>();

    const handleTakePhoto = () => {
        navigation.navigate('IncidentPhotoCapture', {
            bookingId,
            onPhotoTaken: (uri: string) => {
                onAddPhoto(uri);
            },
        });
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
                {photos.map((photoUri, index) => (
                    <View key={index} style={styles.photoCard}>
                        <Image 
                            source={{ uri: photoUri }} 
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
                        onPress={handleTakePhoto}
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