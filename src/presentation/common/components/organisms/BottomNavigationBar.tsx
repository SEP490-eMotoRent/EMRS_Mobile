import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon } from '../atoms/navigationBarIcons/HomeIcon';
import { MapIcon } from '../atoms/navigationBarIcons/MapIcon';
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
    activeColor = '#FFFFFF',
    inactiveColor = '#9E9E9E',
    backgroundColor = '#121212',
}) => {
    const insets = useSafeAreaInsets();

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
        const routeMap: Record<NavRoute, { tab: string; screen: string }> = {
            home: { tab: 'HomeTab', screen: 'Home' },
            trip: { tab: 'TripTab', screen: 'Trip' },
            battery: { tab: 'BatteryTab', screen: 'BranchMap' },
            profile: { tab: 'ProfileTab', screen: 'Profile' },
        };

        const targetRoute = routeMap[route];

        // Navigate to the tab and its root screen
        // @ts-ignore
        navigation.navigate(targetRoute.tab, {
            screen: targetRoute.screen,
        });

        // Then pop to top of that tab's stack
        setTimeout(() => {
            // @ts-ignore
            const tabNav = navigation.getParent(targetRoute.tab);
            if (tabNav) {
                // @ts-ignore
                tabNav.popToTop?.();
            }
        }, 0);
    };

    return (
        <View 
            style={[
                styles.container, 
                { 
                    backgroundColor,
                    paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 8)
                }
            ]}
        >
            <NavItem
                icon={<HomeIcon size={22} />}
                label="Trang Chủ"
                isActive={activeRoute === 'home'}
                onPress={() => handlePress('home')}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
            />
            <NavItem
                icon={<ScheduleIcon size={22} />}
                label="Chuyến Đi"
                isActive={activeRoute === 'trip'}
                onPress={() => handlePress('trip')}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
            />
            <NavItem
                icon={<MapIcon size={22} />}
                label="Bản đồ"
                isActive={activeRoute === 'battery'}
                onPress={() => handlePress('battery')}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
            />
            <NavItem
                icon={<ProfileIcon size={22} />}
                label="Hồ Sơ"
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
        borderTopColor: '#2C2C2C',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});