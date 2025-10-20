import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator } from './HomeNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { TripNavigator } from './TripNavigator';
import { BottomNavigationBar } from '../../../common/components/organisms/BottomNavigationBar';

const Tab = createBottomTabNavigator();

export const NavigationBarNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            id={undefined}
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <BottomNavigationBar {...props} />}
        >
            <Tab.Screen name="HomeTab" component={HomeNavigator} />
            <Tab.Screen name="TripTab" component={TripNavigator} />
            <Tab.Screen name="BatteryTab" component={HomeNavigator} />
            <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
        </Tab.Navigator>
    );
};