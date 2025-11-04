import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../texts/Text';

interface SimpleCameraOverlayProps {
    instruction?: string;
}

export const SimpleCameraOverlay: React.FC<SimpleCameraOverlayProps> = ({ 
    instruction = 'Capture the incident scene clearly'
}) => {
    return (
        <View style={styles.container}>
            {/* Top instruction */}
            <View style={styles.topSection}>
                <Text style={styles.title}>Incident Photo</Text>
                <Text style={styles.instruction}>{instruction}</Text>
            </View>

            {/* Center crosshair */}
            <View style={styles.centerSection}>
                <View style={styles.crosshair}>
                    <View style={styles.horizontalLine} />
                    <View style={styles.verticalLine} />
                </View>
            </View>

            {/* Corner guides */}
            <View style={styles.cornerGuides}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    topSection: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    title: {
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
    },
    instruction: {
        color: '#E5E5E5',
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 300,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crosshair: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalLine: {
        position: 'absolute',
        width: 40,
        height: 2,
        backgroundColor: '#7C3AED',
    },
    verticalLine: {
        position: 'absolute',
        width: 2,
        height: 40,
        backgroundColor: '#7C3AED',
    },
    cornerGuides: {
        ...StyleSheet.absoluteFillObject,
        padding: 40,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#7C3AED',
        borderWidth: 3,
    },
    topLeft: {
        top: 40,
        left: 40,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 40,
        right: 40,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 40,
        left: 40,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 40,
        right: 40,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
    },
});