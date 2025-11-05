import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';

import { ActivityIndicator } from 'react-native';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { CaptureControls } from '../molecules/Documents/CaptureControls';
import { DocumentGuide } from '../molecules/Documents/DocumentGuide';

interface DocumentCameraViewProps {
    documentType: 'front' | 'back';
    documentName: string;
    onCapture: (photoUri: string) => void;
    onClose: () => void;
}

export const DocumentCameraView: React.FC<DocumentCameraViewProps> = ({
    documentType,
    documentName,
    onCapture,
    onClose,
}) => {
    const cameraRef = useRef<CameraView>(null);
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [isCapturing, setIsCapturing] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const toggleFlash = () => {
        setFlashMode(current => current === 'off' ? 'on' : 'off');
    };

    const handleCapture = async () => {
        if (!cameraRef.current || isCapturing) return;

        try {
            setIsCapturing(true);
            
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                skipProcessing: false,
            });

            if (photo?.uri) {
                onCapture(photo.uri);
            }
        } catch (error: any) {
            console.error('Failed to capture photo:', error);
            Alert.alert('Error', 'Failed to capture photo. Please try again.');
        } finally {
            setIsCapturing(false);
        }
    };

    // Permission not determined yet
    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    // Permission denied
    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text variant="title" style={styles.permissionTitle}>
                    Cần quyền truy cập Camera
                </Text>
                <Text style={styles.permissionText}>
                    Chúng tôi cần quyền truy cập camera của bạn để chụp ảnh tài liệu.
                </Text>
                <Button onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Cấp Quyền Truy Cập</Text>
                </Button>
            </View>
        );
    }

    const instruction = documentType === 'front' 
        ? `Position the front of your ${documentName} within the frame`
        : `Position the back of your ${documentName} within the frame`;

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                flash={flashMode}
            >
                <DocumentGuide
                    title={`Capture ${documentType === 'front' ? 'Front' : 'Back'} Side`}
                    instruction={instruction}
                />

                <View style={styles.controlsContainer}>
                    <CaptureControls
                        onCapture={handleCapture}
                        onClose={onClose}
                        flashMode={flashMode}
                        onFlashToggle={toggleFlash}
                        disabled={isCapturing}
                    />
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    permissionTitle: {
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionText: {
        color: '#E5E5E5',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 300,
    },
    permissionButton: {
        paddingHorizontal: 32,
    },
    permissionButtonText: {
        color: '#000',
        fontWeight: '600',
    },
});