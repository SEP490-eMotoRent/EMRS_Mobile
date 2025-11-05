import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, StatusBar, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { CaptureControls } from '../../../profile/ui/molecules/Documents/CaptureControls';
import { SimpleCameraOverlay } from '../atoms/cameras/SimpleCameraOverlay';
import { Text } from '../atoms/texts/Text';
import { Button } from '../atoms/buttons/Button';

type NavigationProp = StackNavigationProp<TripStackParamList, 'IncidentPhotoCapture'>;
type RouteProps = RouteProp<TripStackParamList, 'IncidentPhotoCapture'>;

interface IncidentPhotoCaptureScreenProps {
    navigation: NavigationProp;
    route: RouteProps;
}

export const IncidentPhotoCaptureScreen: React.FC<IncidentPhotoCaptureScreenProps> = ({ 
    navigation, 
    route 
}) => {
    const { onPhotoTaken } = route.params;
    
    const cameraRef = useRef<CameraView>(null);
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
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
                setCapturedPhoto(photo.uri);
            }
        } catch (error: any) {
            console.error('Chụp ảnh thất bại:', error);
            Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleRetake = () => {
        setCapturedPhoto(null);
    };

    const handleConfirm = () => {
        if (capturedPhoto) {
            onPhotoTaken(capturedPhoto);
            navigation.goBack();
        }
    };

    const handleClose = () => {
        if (capturedPhoto) {
            Alert.alert(
                'Hủy ảnh?',
                'Bạn có chắc muốn bỏ ảnh này không?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { 
                        text: 'Bỏ', 
                        style: 'destructive',
                        onPress: () => navigation.goBack()
                    },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text variant="title" style={styles.permissionTitle}>
                    Cần quyền truy cập camera
                </Text>
                <Text style={styles.permissionText}>
                    Chúng tôi cần quyền truy cập camera để chụp ảnh sự cố.
                </Text>
                <Button onPress={requestPermission} label="Cấp quyền" />
            </View>
        );
    }

    if (capturedPhoto) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <View style={styles.previewContainer}>
                    <View style={styles.previewHeader}>
                        <Text variant="title" style={styles.previewTitle}>
                            Xem lại ảnh
                        </Text>
                        <Text style={styles.previewSubtitle}>
                            Đảm bảo chi tiết sự cố rõ ràng và dễ thấy
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
                        <TouchableOpacity 
                            onPress={handleRetake} 
                            style={styles.retakeButton}
                        >
                            <Text style={styles.retakeButtonText}>Chụp lại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={handleConfirm} 
                            style={styles.confirmButton}
                        >
                            <Text style={styles.confirmButtonText}>Dùng ảnh này</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                flash={flashMode}
            >
                <SimpleCameraOverlay instruction="Chụp ảnh rõ ràng về sự cố, hư hỏng xe hoặc hiện trường" />

                <View style={styles.controlsContainer}>
                    <CaptureControls
                        onCapture={handleCapture}
                        onClose={handleClose}
                        flashMode={flashMode}
                        onFlashToggle={toggleFlash}
                        disabled={isCapturing}
                    />
                </View>
            </CameraView>
        </SafeAreaView>
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
    previewContainer: {
        flex: 1,
        backgroundColor: '#000000',
    },
    previewHeader: {
        paddingTop: 20,
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
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    retakeButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    confirmButton: {
        flex: 2,
        backgroundColor: '#10B981',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});