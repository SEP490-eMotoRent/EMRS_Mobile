import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { HomeScreen } from '../../../../features/homepage/ui/screens/HomeScreen';
import { ListView } from '../../../../features/vehicleList/ui/screens/ListViewScreen';
import { HomeStackParamList } from '../../StackParameters/types';
import { BookingNavigator } from './BookingNavigator';
import { BrowseNavigator } from './BrowseNavigator';
import { VehicleDetailsScreen } from '../../../../features/vehicleDetails/ui/screens/VehicleDetailsScreen';
import { MapScreen } from '../../../../features/map/ui/screens/MapScreen';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
    return (
        <Stack.Navigator 
            id={undefined} 
            initialRouteName="Home" 
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Browse" component={BrowseNavigator} />
            <Stack.Screen name="Booking" component={BookingNavigator} />
            <Stack.Screen name="ListView" component={ListView} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
        </Stack.Navigator>
    );
};