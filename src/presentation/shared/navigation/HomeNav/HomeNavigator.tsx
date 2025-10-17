import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { HomeScreen } from '../../../features/homepage/ui/screens/HomeScreen';
import { MapScreen } from '../../../features/map/ui/screens/MapScreen';
import { ListView } from '../../../features/renterVehicleList/ui/screens/ListViewScreen';
import { HomeStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
    return (
        <Stack.Navigator id={undefined} initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* TODO: Add Schedule and Battery screens when ready */}
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="ListView" component={ListView} />
        </Stack.Navigator>
    );
};