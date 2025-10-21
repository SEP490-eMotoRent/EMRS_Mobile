import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BookingDetailsScreen } from '../../../features/tripDetails/ui/screens/BookingDetailsScreen';
import { TripsScreen } from '../../../features/tripListing/ui/screens/TripsScreen';
import { TripStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<TripStackParamList>();

export const TripNavigator: React.FC = () => {
    return (
        <Stack.Navigator 
            id={undefined} 
            initialRouteName="Trip" 
            screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#000000' },
            // ✅ CRITICAL: Enable gesture and back button
            gestureEnabled: true,
            gestureDirection: 'horizontal',
        }}
        >
        <Stack.Screen 
            name="Trip" 
            component={TripsScreen}
            options={{
            // First screen in stack - can't go back
            gestureEnabled: false,
            }}
        />
        <Stack.Screen 
            name="BookingDetails" 
            component={BookingDetailsScreen}
            options={{
            // ✅ This allows Android back button to work
            gestureEnabled: true,
            // ✅ Add slide animation
            cardStyleInterpolator: ({ current, layouts }) => ({
                cardStyle: {
                transform: [
                    {
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                    }),
                    },
                ],
                },
            }),
            }}
        />
        </Stack.Navigator>
    );
};
