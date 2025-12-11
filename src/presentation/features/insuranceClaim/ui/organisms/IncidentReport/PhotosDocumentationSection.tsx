import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TripStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { Icon } from '../../atoms/icons/Icon';

type NavigationProp = StackNavigationProp<TripStackParamList>;

export interface PhotosDocumentationSectionProps {
    photos: string[];
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
                <View style={styles.headerLeft}>
                    <Icon name="camera" size={20} color="#d4c5f9" />
                    <Text style={styles.title}>Chụp ảnh hiện trường</Text>
                </View>
                <TouchableOpacity onPress={handleTakePhoto} style={styles.headerRight}>
                    <Icon name="camera" size={16} color="#d4c5f9" />
                    <Text style={styles.headerAction}>Chụp ảnh</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.hint}>
                Tải lên tối đa {maxPhotos} ảnh ({photos.length}/{maxPhotos})
            </Text>
            <View style={styles.photoGrid}>
                {photos.map((photoUri, index) => (
                    <View key={index} style={styles.photoCard}>
                        <Image 
                            source={{ uri: photoUri }} 
                            style={styles.photoImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => onRemovePhoto(index)}
                            activeOpacity={0.8}
                        >
                            <Icon name="close" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
                {photos.length < maxPhotos && (
                    <TouchableOpacity 
                        style={styles.addPhotoCard}
                        onPress={handleTakePhoto}
                        activeOpacity={0.7}
                    >
                        <Icon name="add" size={28} color="#666" />
                        <Text style={styles.addText}>Thêm ảnh</Text>
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
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    headerAction: {
        fontSize: 13,
        color: '#d4c5f9',
        fontWeight: '600',
    },
    hint: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photoCard: {
        width: 100,
        height: 100,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#ef4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    addPhotoCard: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
    },
    addText: {
        fontSize: 12,
        color: '#666',
        marginTop: 6,
        fontWeight: '500',
    },
});