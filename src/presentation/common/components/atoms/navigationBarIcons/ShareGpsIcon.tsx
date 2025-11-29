import React from 'react';
import { AntDesign } from '@expo/vector-icons';

interface ShareGpsIconProps {
    size?: number;
    color?: string;
}

export const ShareGpsIcon: React.FC<ShareGpsIconProps> = ({ 
    size = 22, 
    color = '#9E9E9E'
}) => {
    return (
        <AntDesign 
            name="sharealt" 
            size={size} 
            color={color} 
        />
    );
};

