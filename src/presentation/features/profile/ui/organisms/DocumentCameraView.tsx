import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guide dimensions (must match GuideOverlay)
const GUIDE_WIDTH = SCREEN_WIDTH * 0.85;
const GUIDE_HEIGHT = GUIDE_WIDTH / 1.6;

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

    const cropToGuide = async (photoUri: string, photoWidth: number, photoHeight: number) => {
        try {
            // Calculate the crop region based on screen guide position
            // The guide is centered on screen
            const guideLeft = (SCREEN_WIDTH - GUIDE_WIDTH) / 2;
            const guideTop = (SCREEN_HEIGHT - GUIDE_HEIGHT) / 2;

            // Convert screen coordinates to photo coordinates
            const scaleX = photoWidth / SCREEN_WIDTH;
            const scaleY = photoHeight / SCREEN_HEIGHT;

            const cropX = guideLeft * scaleX;
            const cropY = guideTop * scaleY;
            const cropWidth = GUIDE_WIDTH * scaleX;
            const cropHeight = GUIDE_HEIGHT * scaleY;

            // Crop the image
            const croppedImage = await ImageManipulator.manipulateAsync(
                photoUri,
                [
                    {
                        crop: {
                            originX: cropX,
                            originY: cropY,
                            width: cropWidth,
                            height: cropHeight,
                        },
                    },
                ],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

            return croppedImage.uri;
        } catch (error) {
            console.error('❌ Crop failed:', error);
            // Return original if crop fails
            return photoUri;
        }
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
                console.log('📸 Original photo:', {
                    uri: photo.uri,
                    width: photo.width,
                    height: photo.height,
                });

                // Crop to guide region
                const croppedUri = await cropToGuide(
                    photo.uri,
                    photo.width,
                    photo.height
                );

                console.log('✂️ Cropped photo:', croppedUri);
                onCapture(croppedUri);
            }
        } catch (error: any) {
            console.error('❌ Failed to capture photo:', error);
            Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
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
        ? `Đặt mặt trước ${documentName} vào trong khung hình`
        : `Đặt mặt sau ${documentName} vào trong khung hình`;

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                flash={flashMode}
            >
                <DocumentGuide
                    title={`Chụp mặt ${documentType === 'front' ? 'trước' : 'sau'}`}
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

            {/* Processing overlay */}
            {isCapturing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#7C3AED" />
                    <Text style={styles.processingText}>Đang xử lý...</Text>
                </View>
            )}
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
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    processingText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});