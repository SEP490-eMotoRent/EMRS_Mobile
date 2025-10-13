import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../../features/homepage/ui/screens/HomeScreen';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
    return (
        <Stack.Navigator id="HomeStack" initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* TODO: Add Schedule and Battery screens when ready */}
        </Stack.Navigator>

    );
};