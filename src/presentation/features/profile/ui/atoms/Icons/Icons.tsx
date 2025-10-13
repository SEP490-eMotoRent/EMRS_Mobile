import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type IconName = 
    | 'back' 
    | 'camera' 
    | 'calendar' 
    | 'id' 
    | 'license' 
    | 'lock' 
    | 'chevron' 
    | 'dropdown'
    | 'edit'
    | 'wallet'
    | 'minus'
    | 'plus'
    | 'arrow'
    | 'check'
    | 'cross'
    | 'bell'
    | 'card'
    | 'location'
    | 'language'
    | 'gift'
    | 'document'
    | 'help'
    | 'terms'
    | 'shield'
    | 'logout';

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    useVectorIcons?: boolean; // Toggle between emoji and vector icons
}

export const Icon: React.FC<IconProps> = ({ 
    name, 
    size = 24, 
    color = '#FFFFFF',
    useVectorIcons = true 
    }) => {
    // Vector icon mapping
    const vectorIcons: Record<IconName, { family: 'material' | 'community' | 'ionicons', name: string }> = {
        back: { family: 'ionicons', name: 'arrow-back' },
        camera: { family: 'ionicons', name: 'camera-outline' },
        calendar: { family: 'ionicons', name: 'calendar-outline' },
        id: { family: 'material', name: 'badge' },
        license: { family: 'ionicons', name: 'card-outline' },
        lock: { family: 'ionicons', name: 'lock-closed-outline' },
        chevron: { family: 'ionicons', name: 'chevron-forward' },
        shield: { family: 'ionicons', name: 'shield-outline' },
        dropdown: { family: 'ionicons', name: 'chevron-down' },
        edit: { family: 'material', name: 'edit' },
        wallet: { family: 'ionicons', name: 'wallet-outline' },
        minus: { family: 'ionicons', name: 'remove' },
        plus: { family: 'ionicons', name: 'add' },
        arrow: { family: 'ionicons', name: 'chevron-forward' },
        check: { family: 'ionicons', name: 'checkmark' },
        cross: { family: 'ionicons', name: 'close' },
        bell: { family: 'ionicons', name: 'notifications-outline' },
        card: { family: 'ionicons', name: 'card-outline' },
        location: { family: 'ionicons', name: 'location-outline' },
        language: { family: 'ionicons', name: 'language-outline' },
        gift: { family: 'ionicons', name: 'gift-outline' },
        document: { family: 'ionicons', name: 'document-text-outline' },
        help: { family: 'ionicons', name: 'help-circle-outline' },
        terms: { family: 'ionicons', name: 'document-outline' },
        logout: { family: 'ionicons', name: 'log-out-outline' },
    };

    // Emoji fallback mapping
    const emojiIcons: Record<IconName, string> = {
        back: '←',
        camera: '📷',
        calendar: '📅',
        id: '🆔',
        license: '📄',
        lock: '🔒',
        chevron: '›',
        shield: '🛡️',
        dropdown: '▼',
        edit: '✎',
        wallet: '💳',
        minus: '−',
        plus: '+',
        arrow: '›',
        check: '✓',
        cross: '✗',
        bell: '🔔',
        card: '💳',
        location: '📍',
        language: '🌐',
        gift: '🎁',
        document: '📄',
        help: '❓',
        terms: '📋',
        logout: '⎋',
    };

    if (useVectorIcons) {
        const iconConfig = vectorIcons[name];
        
        switch (iconConfig.family) {
        case 'material':
            return <MaterialIcons name={iconConfig.name} size={size} color={color} />;
        case 'community':
            return <MaterialCommunityIcons name={iconConfig.name} size={size} color={color} />;
        case 'ionicons':
        default:
            return <Ionicons name={iconConfig.name} size={size} color={color} />;
        }
    }

    // Fallback to emoji icons
    const iconStyle: TextStyle = {
        color,
        fontSize: size,
    };

    return <Text style={[styles.icon, iconStyle]}>{emojiIcons[name] || '?'}</Text>;
};

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center',
    },
});
