import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ID card aspect ratio (roughly 1.6:1)
const GUIDE_WIDTH = SCREEN_WIDTH * 0.85;
const GUIDE_HEIGHT = GUIDE_WIDTH / 1.6;

interface GuideOverlayProps {
    cornerLength?: number;
    cornerWidth?: number;
}

export const GuideOverlay: React.FC<GuideOverlayProps> = ({ 
    cornerLength = 30,
    cornerWidth = 4 
}) => {
    return (
        <View style={styles.container}>
            {/* Top overlay */}
            <View style={styles.topOverlay} />
            
            <View style={styles.middleRow}>
                {/* Left overlay */}
                <View style={styles.sideOverlay} />
                
                {/* Guide rectangle with corners */}
                <View style={[styles.guideBox, { width: GUIDE_WIDTH, height: GUIDE_HEIGHT }]}>
                    {/* Top-left corner */}
                    <View style={[styles.corner, styles.topLeft, { 
                        width: cornerLength, 
                        height: cornerLength,
                        borderTopWidth: cornerWidth,
                        borderLeftWidth: cornerWidth,
                    }]} />
                    
                    {/* Top-right corner */}
                    <View style={[styles.corner, styles.topRight, { 
                        width: cornerLength, 
                        height: cornerLength,
                        borderTopWidth: cornerWidth,
                        borderRightWidth: cornerWidth,
                    }]} />
                    
                    {/* Bottom-left corner */}
                    <View style={[styles.corner, styles.bottomLeft, { 
                        width: cornerLength, 
                        height: cornerLength,
                        borderBottomWidth: cornerWidth,
                        borderLeftWidth: cornerWidth,
                    }]} />
                    
                    {/* Bottom-right corner */}
                    <View style={[styles.corner, styles.bottomRight, { 
                        width: cornerLength, 
                        height: cornerLength,
                        borderBottomWidth: cornerWidth,
                        borderRightWidth: cornerWidth,
                    }]} />
                </View>
                
                {/* Right overlay */}
                <View style={styles.sideOverlay} />
            </View>
            
            {/* Bottom overlay */}
            <View style={styles.bottomOverlay} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        width: SCREEN_WIDTH,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    middleRow: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
    },
    sideOverlay: {
        flex: 1,
        height: GUIDE_HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    guideBox: {
        position: 'relative',
        backgroundColor: 'transparent',
    },
    bottomOverlay: {
        width: SCREEN_WIDTH,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    corner: {
        position: 'absolute',
        borderColor: '#7C3AED',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomRightRadius: 8,
    },
});