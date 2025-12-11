import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

export interface IconProps {
    name: 
        // Existing icons
        | 'phone' 
        | 'location' 
        | 'document' 
        | 'check'
        // Insurance Claims icons
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
        | 'car'
        // Incident Report icons
        | 'refresh'
        | 'time'
        | 'map'
        | 'camera'
        | 'close'
        | 'add'
        | 'info'
        | 'edit'
        | 'warning'
        | 'checkmark'
        | 'send';
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
        
        // Insurance Claims icons
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
        
        // Incident Report icons
        'refresh': { library: 'Ionicons', iconName: 'reload-outline' },
        'time': { library: 'Ionicons', iconName: 'time-outline' },
        'map': { library: 'Ionicons', iconName: 'map-outline' },
        'camera': { library: 'Ionicons', iconName: 'camera-outline' },
        'close': { library: 'Ionicons', iconName: 'close' },
        'add': { library: 'Ionicons', iconName: 'add' },
        'info': { library: 'Ionicons', iconName: 'information-circle-outline' },
        'edit': { library: 'Feather', iconName: 'edit-2' },
        'warning': { library: 'Ionicons', iconName: 'warning-outline' },
        'checkmark': { library: 'Ionicons', iconName: 'checkmark-circle' },
        'send': { library: 'Ionicons', iconName: 'send' },
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
        case 'FontAwesome5':
            return <FontAwesome5 name={iconName} size={size} color={color} />;
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        case 'MaterialIcons':
            return <MaterialIcons name={iconName} size={size} color={color} />;
        case 'Ionicons':
            return <Ionicons name={iconName} size={size} color={color} />;
        case 'Feather':
            return <Feather name={iconName} size={size} color={color} />;
        default:
            return null;
    }
};