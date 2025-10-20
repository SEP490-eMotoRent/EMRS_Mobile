import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { HomeScreen } from '../../../features/homepage/ui/screens/HomeScreen';
import { HomeStackParamList } from '../StackParameters/types';
import { BookingNavigator } from './BookingNavigator';
import { BrowseNavigator } from './BrowseNavigator';

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
        </Stack.Navigator>
    );
};