// TripNavigator.tsx

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BookingDetailsScreen } from '../../../../features/staff/handover/ui/screens';
import { TripsScreen } from '../../../../features/tripListing/ui/screens/TripsScreen';
import { TripStackParamList } from '../../StackParameters/types';
import { SignContractScreen } from '../../../../features/contract/ui/screens/SignContractScreen';
import { EmergencyContactScreen } from '../../../../features/insuranceClaim/ui/screens/EmergencyContactScreen';
import { IncidentReportScreen } from '../../../../features/insuranceClaim/ui/screens/IncidentReportScreen';
import TrackingGPSScreen from '../../../../features/staff/tracking/ui/screens/TrackingGPSScreen';

const Stack = createStackNavigator<TripStackParamList>();

export const TripNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Trip"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#000000" },
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      {/* ROOT: Trips List */}
      <Stack.Screen
        name="Trip"
        component={TripsScreen}
        options={{
          gestureEnabled: false, // First screen — no back
        }}
      />

      {/* Booking Details */}
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          gestureEnabled: true,
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

      {/* Sign Contract */}
      <Stack.Screen
        name="SignContract"
        component={SignContractScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Emergency Contact */}
      <Stack.Screen
        name="EmergencyContact"
        component={EmergencyContactScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
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

      {/* Incident Report */}
      <Stack.Screen
        name="IncidentReport"
        component={IncidentReportScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
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

      {/* GPS Tracking */}
      <Stack.Screen
        name="TrackingGPS"
        component={TrackingGPSScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};