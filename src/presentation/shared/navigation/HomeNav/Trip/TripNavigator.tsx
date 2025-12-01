import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BookingDetailsScreen, HandoverReceiptReportScreen, RentedVehicleDetailsScreen } from '../../../../features/staff/handover/ui/screens';
import { TripsScreen } from '../../../../features/tripListing/ui/screens/TripsScreen';
import { TripStackParamList } from '../../StackParameters/types';
import { SignContractScreen } from '../../../../features/contract/ui/screens/SignContractScreen';
import { EmergencyContactScreen } from '../../../../features/insuranceClaim/ui/screens/EmergencyContactScreen';
import { IncidentReportScreen } from '../../../../features/insuranceClaim/ui/screens/IncidentReportScreen';
import { IncidentPhotoCaptureScreen } from '../../../../features/insuranceClaim/ui/screens/IncidentPhotoCaptureScreen';
import TrackingGPSScreen from '../../../../features/staff/tracking/ui/screens/TrackingGPSScreen';
import { ReturnReportScreen } from '../../../../features/tripDetails/ui/screens/ReturnReportScreen';
import { ReturnCompleteScreen } from '../../../../features/tripDetails/ui/screens/ReturnCompleteScreen';
import { CreateTicketScreen } from '../../../../features/insuranceClaim/ui/screens/TicketSubmission/CreateTicketScreen';
import { TicketListScreen } from '../../../../features/insuranceClaim/ui/screens/TicketSubmission/TicketListScreen';
import { TicketDetailScreen } from '../../../../features/insuranceClaim/ui/screens/TicketSubmission/TicketDetailScreen';
import { ChargingListBookingScreen } from '../../../../features/charging/ui/screens';

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
          gestureEnabled: false,
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

      {/* Create Ticket */}
      <Stack.Screen
        name="CreateTicket"
        component={CreateTicketScreen}
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

      {/* Ticket List */}
      <Stack.Screen
        name="TicketList"
        component={TicketListScreen}
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

      {/* Ticket Detail */}
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
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

      {/* Incident Photo Capture (Modal-style) */}
      <Stack.Screen
        name="IncidentPhotoCapture"
        component={IncidentPhotoCaptureScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0],
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
      <Stack.Screen
        name="ReturnReport"
        component={ReturnReportScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="HandoverReceiptReport"
        component={HandoverReceiptReportScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ReturnComplete"
        component={ReturnCompleteScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="RentedVehicleDetails"
        component={RentedVehicleDetailsScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ChargingListBooking"
        component={ChargingListBookingScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};