import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface IconProps {
    name: 
        // Existing icons
        | 'phone' 
        | 'location' 
        | 'document' 
        | 'check'
        // New icons for Insurance Claims
        | 'shield'
        | 'calendar'
        | 'arrow'
        | 'arrow-left'
        | 'bell'
        | 'card'
        | 'language'
        | 'help'
        | 'terms'
        | 'logout'
        | 'gift'
        | 'id-card'
        | 'car';
    color?: string;
    size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, color = '#fff', size = 24 }) => {
    const iconMap: Record<string, { library: string; iconName: string }> = {
        // Existing icons
        'phone': { library: 'FontAwesome', iconName: 'phone' },
        'location': { library: 'Ionicons', iconName: 'location-sharp' },
        'document': { library: 'Ionicons', iconName: 'document-text' },
        'check': { library: 'FontAwesome', iconName: 'check' },
        
        // New icons for Insurance Claims
        'shield': { library: 'MaterialCommunityIcons', iconName: 'shield-check' },
        'calendar': { library: 'FontAwesome', iconName: 'calendar' },
        'arrow': { library: 'FontAwesome', iconName: 'chevron-right' },
        'arrow-left': { library: 'FontAwesome', iconName: 'chevron-left' },
        'bell': { library: 'FontAwesome', iconName: 'bell' },
        'card': { library: 'FontAwesome', iconName: 'credit-card' },
        'language': { library: 'FontAwesome', iconName: 'language' },
        'help': { library: 'FontAwesome', iconName: 'question-circle' },
        'terms': { library: 'FontAwesome', iconName: 'file-text' },
        'logout': { library: 'MaterialIcons', iconName: 'logout' },
        'gift': { library: 'FontAwesome', iconName: 'gift' },
        'id-card': { library: 'FontAwesome', iconName: 'id-card' },
        'car': { library: 'FontAwesome', iconName: 'car' },
    };

    const iconConfig = iconMap[name];
    
    if (!iconConfig) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    const { library, iconName } = iconConfig;

    switch (library) {
        case 'FontAwesome':
            return <FontAwesome name={iconName} size={size} color={color} />;
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        case 'MaterialIcons':
            return <MaterialIcons name={iconName} size={size} color={color} />;
        case 'Ionicons':
            return <Ionicons name={iconName} size={size} color={color} />;
        default:
            return null;
    }
};