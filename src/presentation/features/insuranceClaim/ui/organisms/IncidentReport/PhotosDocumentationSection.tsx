import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PhotoUploadCard } from '../../molecules';

export interface PhotosDocumentationSectionProps {
    photos: (string | null)[];
    onAddPhoto: (index: number) => void;
    maxPhotos?: number;
}

export const PhotosDocumentationSection: React.FC<PhotosDocumentationSectionProps> = ({
    photos,
    onAddPhoto,
    maxPhotos = 4,
    }) => (
    <View style={styles.section}>
        <View style={styles.header}>
        <Text style={styles.title}>Photos Documentation</Text>
        <View style={styles.headerRight}>
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.headerAction}>Take Photos</Text>
        </View>
        </View>
        <Text style={styles.hint}>Upload up to {maxPhotos} photos of the incident</Text>
        <View style={styles.photoGrid}>
        {Array.from({ length: maxPhotos }).map((_, index) => (
            <PhotoUploadCard
            key={index}
            onPress={() => onAddPhoto(index)}
            hasPhoto={!!photos[index]}
            />
        ))}
        </View>
    </View>
);

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
});
