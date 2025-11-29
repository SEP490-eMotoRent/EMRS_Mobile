import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { TextLabel } from '../atoms/navigationBarIcons/TextLabel';
import { colors } from '../../theme/colors';

export type NavRoute = 'home' | 'trip' | 'battery' | 'shareGps' | 'profile';

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
            case 'ShareGpsTab': return 'shareGps';
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
            shareGps: { tab: 'ShareGpsTab', screen: 'SessionList' },
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

    // Get tab-specific colors
    const getTabColor = (route: NavRoute) => {
        if (activeRoute !== route) return colors.text.secondary;
        switch (route) {
            case 'home': return '#7CFFCB';
            case 'trip': return '#C9B6FF';
            case 'battery': return '#FFD666';
            case 'shareGps': return '#7DB3FF';
            case 'profile': return '#FF6B6B';
            default: return activeColor;
        }
    };

    const navItems = [
        {
            route: 'home' as NavRoute,
            icon: 'home',
            label: 'Trang Chủ',
        },
        {
            route: 'trip' as NavRoute,
            icon: 'calendar',
            label: 'Chuyến Đi',
        },
        {
            route: 'battery' as NavRoute,
            icon: 'thunderbolt',
            label: 'Bản đồ',
            isCenter: true,
        },
        {
            route: 'shareGps' as NavRoute,
            icon: 'share-alt',
            label: 'GPS',
        },
        {
            route: 'profile' as NavRoute,
            icon: 'user',
            label: 'Hồ Sơ',
        },
    ];

    return (
        <View 
            style={[
                styles.container, 
                { 
                    backgroundColor: colors.background,
                    paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 8)
                }
            ]}
        >
            {navItems.map((item) => (
                <TouchableOpacity
                    key={item.route}
                    style={[styles.navItem, item.isCenter && styles.centerNavItem]}
                    onPress={() => handlePress(item.route)}
                    activeOpacity={0.7}
                >
                    {item.isCenter ? (
                        <View style={styles.centerButtonContainer}>
                            <View
                                style={[
                                    styles.centerButton,
                                    activeRoute === item.route && styles.centerButtonActive,
                                ]}
                            >
                                <AntDesign
                                    name={item.icon as any}
                                    size={28}
                                    color={activeRoute === item.route ? '#0B0B0F' : '#6B7280'}
                                />
                            </View>
                        </View>
                    ) : (
                        <>
                            <AntDesign
                                name={item.icon as any}
                                size={24}
                                color={getTabColor(item.route)}
                            />
                            <View
                                style={[
                                    styles.labelContainer,
                                    activeRoute === item.route && styles.activeLabelContainer,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.labelBackground,
                                        activeRoute === item.route && styles.activeLabelBackground,
                                        { backgroundColor: activeRoute === item.route ? `${getTabColor(item.route)}20` : 'transparent' }
                                    ]}
                                />
                                <TextLabel
                                    color={getTabColor(item.route)}
                                    fontSize={10}
                                    fontWeight={activeRoute === item.route ? '600' : '400'}
                                >
                                    {item.label}
                                </TextLabel>
                            </View>
                        </>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        paddingBottom: 24,
        position: 'relative',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    centerNavItem: {
        justifyContent: 'flex-end',
        paddingBottom: 0,
    },
    centerButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFD666',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -120,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: colors.background,
    },
    centerButtonActive: {
        backgroundColor: '#FFD666',
        transform: [{ scale: 1.1 }],
        shadowColor: '#FFD666',
        shadowOpacity: 0.6,
    },
    labelContainer: {
        marginTop: 4,
        position: 'relative',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    activeLabelContainer: {
        // Active state styling handled by background
    },
    labelBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 12,
    },
    activeLabelBackground: {
        opacity: 0.2,
    },
});