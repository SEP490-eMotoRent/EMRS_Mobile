// organisms/navigation/BottomNavigationBar.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavItem } from '../molecules/navigationBar/NavItem';
import { HomeIcon } from '../atoms/navigationBarIcons/HomeIcon';
import { ScheduleIcon } from '../atoms/navigationBarIcons/ScheduleIcon';
import { BatteryIcon } from '../atoms/navigationBarIcons/BatteryIcon';
import { ProfileIcon } from '../atoms/navigationBarIcons/ProfileIcon';

export type NavRoute = 'home' | 'schedule' | 'battery' | 'profile';

interface BottomNavigationBarProps {
    activeRoute: NavRoute;
    onNavigate?: (route: NavRoute) => void;
    activeColor?: string;
    inactiveColor?: string;
    backgroundColor?: string;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
    activeRoute,
    onNavigate,
    activeColor = '#007AFF',
    inactiveColor = '#8E8E93',
    backgroundColor = '#FFFFFF',
    }) => {
    const handlePress = (route: NavRoute) => {
        onNavigate?.(route);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
        <NavItem
            icon={<HomeIcon size={24} />}
            label="Home"
            isActive={activeRoute === 'home'}
            onPress={() => handlePress('home')}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
        />
        <NavItem
            icon={<ScheduleIcon size={24} />}
            label="Schedule"
            isActive={activeRoute === 'schedule'}
            onPress={() => handlePress('schedule')}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
        />
        <NavItem
            icon={<BatteryIcon size={24} />}
            label="Battery"
            isActive={activeRoute === 'battery'}
            onPress={() => handlePress('battery')}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
        />
        <NavItem
            icon={<ProfileIcon size={24} />}
            label="Profile"
            isActive={activeRoute === 'profile'}
            onPress={() => handlePress('profile')}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
});