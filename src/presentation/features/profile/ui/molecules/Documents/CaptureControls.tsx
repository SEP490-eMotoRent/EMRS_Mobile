import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { FlashMode } from 'expo-camera';
import { CameraButton } from '../../atoms/Documents/CameraButton';
import { FlashToggle } from '../../atoms/Documents/FlashToggle';
import { Icon } from '../../atoms/Icons/Icons';
import { Text } from '../../atoms/Text';

interface CaptureControlsProps {
    onCapture: () => void;
    onClose: () => void;
    flashMode: FlashMode;
    onFlashToggle: () => void;
    disabled?: boolean;
}

export const CaptureControls: React.FC<CaptureControlsProps> = ({
    onCapture,
    onClose,
    flashMode,
    onFlashToggle,
    disabled = false,
}) => {
    return (
        <View style={styles.container}>
            {/* Left: Close button */}
            <TouchableOpacity onPress={onClose} style={styles.sideButton}>
                <Icon name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            
            {/* Center: Capture button */}
            <View style={styles.centerContainer}>
                <CameraButton onPress={onCapture} disabled={disabled} />
                <Text style={styles.captureHint}>Nhấn để chụp</Text>
            </View>
            
            {/* Right: Flash toggle */}
            <View style={styles.sideButton}>
                <FlashToggle flashMode={flashMode} onToggle={onFlashToggle} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: 'transparent',
    },
    sideButton: {
        width: 60,
        alignItems: 'center',
    },
    centerContainer: {
        alignItems: 'center',
        gap: 8,
    },
    captureHint: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});