import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface ProfileIconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
    size = 24,
    color = '#000000',
    strokeWidth = 2,
    }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
            cx="12"
            cy="12"
            r="9"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Circle
            cx="12"
            cy="10"
            r="3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6.168 18.849C6.82713 17.2366 8.30344 16 10.0659 16H13.9341C15.6966 16 17.1729 17.2366 17.832 18.849"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </Svg>
    );
};