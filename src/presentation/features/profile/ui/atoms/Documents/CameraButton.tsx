import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

interface CameraButtonProps {
    onPress: () => void;
    disabled?: boolean;
    size?: number;
}

export const CameraButton: React.FC<CameraButtonProps> = ({ 
    onPress, 
    disabled = false,
    size = 70 
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[styles.container, { width: size, height: size }]}
        >
            <View style={[styles.outerRing, { width: size, height: size }]}>
                <View style={[styles.innerCircle, { 
                    width: size - 10, 
                    height: size - 10,
                    opacity: disabled ? 0.5 : 1 
                }]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerRing: {
        borderRadius: 9999,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    innerCircle: {
        borderRadius: 9999,
        backgroundColor: '#FFFFFF',
    },
});