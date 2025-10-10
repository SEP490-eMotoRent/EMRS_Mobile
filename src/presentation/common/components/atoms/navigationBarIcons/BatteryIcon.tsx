import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface BatteryIconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export const BatteryIcon: React.FC<BatteryIconProps> = ({
    size = 24,
    color = '#000000',
    strokeWidth = 2,
    }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
            x="2"
            y="7"
            width="18"
            height="10"
            rx="2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M20 10H22V14H20"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6 11H14"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </Svg>
    );
};