import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FlashMode } from 'expo-camera';
import { Icon } from '../Icons/Icons';

interface FlashToggleProps {
    flashMode: FlashMode;
    onToggle: () => void;
}

export const FlashToggle: React.FC<FlashToggleProps> = ({ flashMode, onToggle }) => {
    // In expo-camera v17, FlashMode is 'off' | 'on' | 'auto'
    // There's no 'torch' mode anymore
    const isOn = flashMode === 'on';
    
    return (
        <TouchableOpacity
            onPress={onToggle}
            style={[styles.container, isOn && styles.active]}
            activeOpacity={0.7}
        >
            <Icon 
                name={isOn ? 'flash' : 'flash-off'} 
                size={24} 
                color={isOn ? '#FFD700' : '#FFFFFF'} 
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    active: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
});