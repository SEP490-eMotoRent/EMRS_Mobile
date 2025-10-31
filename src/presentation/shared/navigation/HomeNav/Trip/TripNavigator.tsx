import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BookingDetailsScreen } from '../../../../features/staff/handover/ui/screens';
import { TripsScreen } from '../../../../features/tripListing/ui/screens/TripsScreen';
import { TripStackParamList } from '../../StackParameters/types';
import { SignContractScreen } from '../../../../features/contract/ui/screens/SignContractScreen';
import { EmergencyContactScreen } from '../../../../features/insuranceClaim/ui/screens/EmergencyContactScreen';
import { IncidentReportScreen } from '../../../../features/insuranceClaim/ui/screens/IncidentReportScreen';


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
        <Stack.Screen 
            name="SignContract" 
            component={SignContractScreen}
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen
            name="EmergencyContact"
            component={EmergencyContactScreen}
            options={{
            presentation: 'card',
            gestureEnabled: true,
            }}
        />
        <Stack.Screen
            name="IncidentReport"
            component={IncidentReportScreen}
            options={{
            presentation: 'card',
            gestureEnabled: true,
            }}
        />
        </Stack.Navigator>
    );
};
