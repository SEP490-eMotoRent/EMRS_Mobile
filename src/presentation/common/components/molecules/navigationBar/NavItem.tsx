// molecules/navigation/NavItem.tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { TextLabel } from '../../atoms/navigationBarIcons/TextLabel';


interface IconProps {
    color?: string;
    size?: number;
    strokeWidth?: number;
}

interface NavItemProps {
    icon: React.ReactElement<IconProps>;
    label: string;
    isActive?: boolean;
    onPress?: () => void;
    activeColor?: string;
    inactiveColor?: string;
    }

    export const NavItem: React.FC<NavItemProps> = ({
    icon,
    label,
    isActive = false,
    onPress,
    activeColor = '#007AFF',
    inactiveColor = '#8E8E93',
    }) => {
    const color = isActive ? activeColor : inactiveColor;

    return (
        <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
        >
        <View style={styles.iconContainer}>
            {React.cloneElement(icon, { color })}
        </View>
        <TextLabel
            color={color}
            fontSize={10}
            fontWeight={isActive ? '600' : '400'}
        >
            {label}
        </TextLabel>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        marginBottom: 4,
    },
});