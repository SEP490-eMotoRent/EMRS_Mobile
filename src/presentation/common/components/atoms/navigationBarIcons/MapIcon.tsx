import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MapIconProps {
    size?: number;
    color?: string;
}

export const MapIcon: React.FC<MapIconProps> = ({ 
    size = 24, 
    color = '#000000' 
}) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 2L3 6V20L9 16L15 20L21 16V2L15 6L9 2Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9 2V16"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 6V20"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};