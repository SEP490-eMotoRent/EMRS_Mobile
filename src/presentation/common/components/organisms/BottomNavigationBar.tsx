import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BatteryIcon } from '../atoms/navigationBarIcons/BatteryIcon';
import { HomeIcon } from '../atoms/navigationBarIcons/HomeIcon';
import { ProfileIcon } from '../atoms/navigationBarIcons/ProfileIcon';
import { ScheduleIcon } from '../atoms/navigationBarIcons/ScheduleIcon';
import { NavItem } from '../molecules/navigationBar/NavItem';

export type NavRoute = 'home' | 'trip' | 'battery' | 'profile';

interface BottomNavigationBarProps extends BottomTabBarProps {
    activeColor?: string;
    inactiveColor?: string;
    backgroundColor?: string;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
    state,
    navigation,
    activeColor = '#FFFFFF',          // white for active
    inactiveColor = '#9E9E9E',        // dimmed gray for inactive
    backgroundColor = '#121212',      // dark background
}) => {
    // Map React Navigation route names to our NavRoute type
    const routeNameToNavRoute = (routeName: string): NavRoute => {
        switch (routeName) {
            case 'HomeTab': return 'home';
            case 'TripTab': return 'trip';
            case 'BatteryTab': return 'battery';
            case 'ProfileTab': return 'profile';
            default: return 'home';
        }
    };

    const activeRoute = routeNameToNavRoute(state.routeNames[state.index]);

    const handlePress = (route: NavRoute) => {
        const routeMap: Record<NavRoute, string> = {
            home: 'HomeTab',
            trip: 'TripTab',
            battery: 'BatteryTab',
            profile: 'ProfileTab',
        };
        navigation.navigate(routeMap[route]);
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
                label="Trips"
                isActive={activeRoute === 'trip'}
                onPress={() => handlePress('trip')}
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
        borderTopColor: '#2C2C2C', // subtle dark divider
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});