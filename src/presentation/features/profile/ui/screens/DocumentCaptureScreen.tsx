import React, { useState } from 'react';
import { Alert, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { DocumentCaptureTemplate } from '../templates/DocumentCaptureTemplate';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface DocumentCaptureScreenProps {
    navigation: any;
    route: {
        params: {
            documentType: 'citizen' | 'license';
            side: 'front' | 'back';
            onPhotoTaken: (uri: string, side: 'front' | 'back') => void;
        };
    };
}

export const DocumentCaptureScreen: React.FC<DocumentCaptureScreenProps> = ({ 
    navigation, 
    route 
}) => {
    const { documentType, side, onPhotoTaken } = route.params;
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Determine document name for display
    const documentName = documentType === 'citizen' ? 'Citizen ID' : "Driver's License";

    const handleCapture = (photoUri: string) => {
        console.log('📸 Photo captured:', photoUri);
        setCapturedPhoto(photoUri);
    };

    const handleRetake = () => {
        setCapturedPhoto(null);
    };

    const handleConfirm = async () => {
        if (!capturedPhoto) return;

        try {
            setIsProcessing(true);
            
            // Pass photo back to parent screen
            onPhotoTaken(capturedPhoto, side);
            
            // Navigate back
            navigation.goBack();
        } catch (error: any) {
            console.error('❌ Error confirming photo:', error);
            Alert.alert('Error', 'Failed to process photo. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (capturedPhoto) {
            Alert.alert(
                'Discard Photo?',
                'Are you sure you want to discard this photo?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Discard', 
                        style: 'destructive',
                        onPress: () => navigation.goBack()
                    },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    // Show preview screen if photo is captured
    if (capturedPhoto) {
        return (
            <View style={styles.previewContainer}>
                <View style={styles.previewHeader}>
                    <Text variant="title" style={styles.previewTitle}>
                        Review Photo
                    </Text>
                    <Text style={styles.previewSubtitle}>
                        Make sure the {documentName} is clear and readable
                    </Text>
                </View>

                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: capturedPhoto }} 
                        style={styles.previewImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.previewActions}>
                    <Button 
                        onPress={handleRetake} 
                        style={styles.retakeButton}
                        variant="secondary"
                        disabled={isProcessing}
                    >
                        <Text style={styles.retakeButtonText}>Retake</Text>
                    </Button>

                    <Button 
                        onPress={handleConfirm} 
                        style={styles.confirmButton}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.confirmButtonText}>Use This Photo</Text>
                        )}
                    </Button>
                </View>
            </View>
        );
    }

    // Show camera capture screen
    return (
        <DocumentCaptureTemplate
            documentType={side}
            documentName={documentName}
            onCapture={handleCapture}
            onClose={handleClose}
        />
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        flex: 1,
        backgroundColor: '#000000',
    },
    previewHeader: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    previewTitle: {
        color: '#FFFFFF',
        marginBottom: 8,
    },
    previewSubtitle: {
        color: '#AAAAAA',
        fontSize: 14,
        textAlign: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    previewActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 30,
        gap: 12,
    },
    retakeButton: {
        flex: 1,
    },
    retakeButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    confirmButton: {
        flex: 2,
    },
    confirmButtonText: {
        color: '#000000',
        fontWeight: '600',
    },
});