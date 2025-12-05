import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TripStackParamList } from '../../StackParameters/types';

// ============================================================================
// TRIP LISTING (Renter's Trips Screen)
// ============================================================================
import { TripsScreen } from '../../../../features/tripListing/ui/screens/TripsScreen';

// ============================================================================
// BOOKING & VEHICLE SCREENS (Shared by Staff & Renter)
// ============================================================================
import { 
  BookingDetailsScreen,
  HandoverReceiptReportScreen, 
  RentedVehicleDetailsScreen 
} from '../../../../features/staff/handover/ui/screens';

// ============================================================================
// CONTRACT & SIGNING
// ============================================================================
import { SignContractScreen } from '../../../../features/contract/ui/screens/SignContractScreen';

// ============================================================================
// EMERGENCY & SUPPORT
// ============================================================================
import { EmergencyContactScreen } from '../../../../features/insuranceClaim/ui/screens/EmergencyContactScreen';
import { IncidentReportScreen } from '../../../../features/insuranceClaim/ui/screens/IncidentReportScreen';
import { IncidentPhotoCaptureScreen } from '../../../../features/insuranceClaim/ui/screens/IncidentPhotoCaptureScreen';

// ============================================================================
// TRACKING
// ============================================================================
import TrackingGPSScreen from '../../../../features/staff/tracking/ui/screens/TrackingGPSScreen';

// ============================================================================
// RETURN & RECEIPTS
// ============================================================================
import { ReturnReceiptReportScreen } from '../../../../features/tripDetails/ui/screens/ReturnReceiptReportScreen';
import { ReturnCompleteScreen } from '../../../../features/tripDetails/ui/screens/ReturnCompleteScreen';

// ============================================================================
// TICKET MANAGEMENT
// ============================================================================
import { CreateTicketScreen } from '../../../../features/insuranceClaim/ui/screens/TicketSubmission/CreateTicketScreen';
import { TicketListScreen } from '../../../../features/insuranceClaim/ui/screens/TicketSubmission/TicketListScreen';
import { TicketDetailScreen } from '../../../../features/insuranceClaim/ui/screens/TicketSubmission/TicketDetailScreen';

// ============================================================================
// CHARGING
// ============================================================================
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
      {/* ====================================================================== */}
      {/* ROOT: Trips List Screen */}
      {/* ====================================================================== */}
      <Stack.Screen
        name="Trip"
        component={TripsScreen}
        options={{
          gestureEnabled: false,
        }}
      />

      {/* ====================================================================== */}
      {/* BOOKING DETAILS (Used by both Staff & Renter) */}
      {/* ====================================================================== */}
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

      {/* ====================================================================== */}
      {/* CONTRACT & SIGNING */}
      {/* ====================================================================== */}
      <Stack.Screen
        name="SignContract"
        component={SignContractScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* ====================================================================== */}
      {/* EMERGENCY & SUPPORT */}
      {/* ====================================================================== */}
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

      {/* ====================================================================== */}
      {/* TICKET MANAGEMENT */}
      {/* ====================================================================== */}
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

      {/* ====================================================================== */}
      {/* INCIDENT REPORTING */}
      {/* ====================================================================== */}
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

      {/* ====================================================================== */}
      {/* GPS TRACKING */}
      {/* ====================================================================== */}
      <Stack.Screen
        name="TrackingGPS"
        component={TrackingGPSScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />

      {/* ====================================================================== */}
      {/* RECEIPTS & REPORTS */}
      {/* ====================================================================== */}
      <Stack.Screen
        name="HandoverReceiptReport"
        component={HandoverReceiptReportScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name="ReturnReceiptReport"
        component={ReturnReceiptReportScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />

      {/* ====================================================================== */}
      {/* RETURN COMPLETE */}
      {/* ====================================================================== */}
      <Stack.Screen
        name="ReturnComplete"
        component={ReturnCompleteScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* ====================================================================== */}
      {/* VEHICLE DETAILS */}
      {/* ====================================================================== */}
      <Stack.Screen
        name="RentedVehicleDetails"
        component={RentedVehicleDetailsScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />

      {/* ====================================================================== */}
      {/* CHARGING */}
      {/* ====================================================================== */}
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