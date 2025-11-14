import { useMemo } from 'react';
import { Region } from 'react-native-maps';

export interface MarkerSize {
    bubbleSize: number;
    iconSize: number;
    borderWidth: number;
    pointerSize: { left: number; right: number; top: number };
}

interface UseMarkerSizeProps {
    region: Region;
    isSelected?: boolean;
}

export const useMarkerSize = ({ region, isSelected = false }: UseMarkerSizeProps): MarkerSize => {
    return useMemo(() => {
        // Calculate zoom level from latitudeDelta
        // Smaller delta = more zoomed in = larger markers
        const zoomLevel = Math.log(360 / region.latitudeDelta) / Math.LN2;
        
        // Define size thresholds
        let bubbleSize: number;
        let iconSize: number;
        let borderWidth: number;
        
        if (zoomLevel < 11) {
            // Very zoomed out - tiny markers
            bubbleSize = 32;
            iconSize = 14;
            borderWidth = 2;
        } else if (zoomLevel < 13) {
            // Medium zoom - small markers
            bubbleSize = 38;
            iconSize = 16;
            borderWidth = 2;
        } else if (zoomLevel < 15) {
            // Getting closer - normal markers
            bubbleSize = 44;
            iconSize = 18;
            borderWidth = 3;
        } else {
            // Very zoomed in - large markers
            bubbleSize = 48;
            iconSize = 20;
            borderWidth = 3;
        }
        
        // Selected markers are always slightly bigger
        if (isSelected) {
            bubbleSize += 6;
            iconSize += 2;
            borderWidth += 1;
        }
        
        // Calculate proportional pointer size
        const pointerSize = {
            left: bubbleSize * 0.25,
            right: bubbleSize * 0.25,
            top: bubbleSize * 0.42,
        };
        
        return {
            bubbleSize,
            iconSize,
            borderWidth,
            pointerSize,
        };
    }, [region.latitudeDelta, isSelected]);
};

/**
 * Helper to get marker anchor point
 * Always returns { x: 0.5, y: 1 } for pin-style markers
 * (centered horizontally, bottom of pin touches coordinate)
 */
export const getMarkerAnchor = () => ({ x: 0.5, y: 1 });