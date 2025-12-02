import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  StaffBottomNavigationBar,
  StaffNavRoute,
} from "../../../common/components/organisms/StaffBottomNavigationBar";
import { createStackNavigator } from "@react-navigation/stack";
import { StaffStackParamList } from "../StackParameters/types";
import {
  CustomerRentalsScreen,
  BookingDetailsScreen,
  SelectVehicleScreen,
  VehicleInspectionScreen,
  HandoverReportScreen,
  HandoverReceiptReportScreen,
  AwaitingApprovalScreen,
  HandoverDocumentScreen,
  HandoverCompleteScreen,
  RentedVehicleDetailsScreen,
} from "../../../features/staff/handover/ui/screens";
import { ChargingScreen } from "../../../features/staff/charging/ui/screens";
import {
  StaffHomeScreen,
  MotorbikeDetailScreen,
  StaffVehicleListScreen,
} from "../../../features/staff/home/ui/screens";
import { StaffProfileScreen } from "../../../features/staff/profile/ui/screens";
import { RentalScreen } from "../../../features/staff/rental/ui/screens";
import {
  VehicleConfirmationScreen,
  ReturnInspectionScreen,
  AIAnalysisScreen,
  ManualInspectionScreen,
  AdditionalFeesScreen,
  ReturnReportScreen,
} from "../../../features/staff/return/ui/screens";
import {
  ScanFaceScreen,
  ScanResultScreen,
  ScanCitizenResultScreen,
} from "../../../features/staff/scan/ui/screens";
import TrackingGPSScreen from "../../../features/staff/tracking/ui/screens/TrackingGPSScreen";
import { BookingReturnListScreen } from "../../../features/staff/return/ui/screens/BookingReturnListScreen";
import { FaceScanCameraScreen } from "../../../features/staff/scan/ui/screens/FaceScanCameraScreen ";
import ChargingListBookingScreen from "../../../features/charging/ui/screens/ChargingListBookingScreen";
import {
  TicketDetailScreen,
  TicketListScreen,
} from "../../../features/staff/ticket/ui/screens";

const Stack = createStackNavigator<StaffStackParamList>();

export const StaffNavigator: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<StaffNavRoute>("home");

  const renderScreen = () => {
    switch (activeRoute) {
      case "home":
        return <StaffHomeScreen />;
      case "rental":
        return <RentalScreen />;
      case "profile":
        return <StaffProfileScreen />;
      case "scanface":
        return <ScanFaceScreen />;
      case "charging":
        return <ChargingScreen />;
      default:
        return <StaffHomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Navigator
        id={undefined}
        screenOptions={{ headerShown: false }}
        initialRouteName="Rental"
      >
        <Stack.Screen name="Rental">
          {() => (
            <View style={styles.tabContainer}>
              <View style={styles.content}>{renderScreen()}</View>
              <StaffBottomNavigationBar
                activeRoute={activeRoute}
                onNavigate={setActiveRoute}
              />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="ScanResult" component={ScanResultScreen} />
        <Stack.Screen
          name="ScanCitizenResult"
          component={ScanCitizenResultScreen}
        />
        <Stack.Screen
          name="CustomerRentals"
          component={CustomerRentalsScreen}
        />
        <Stack.Screen name="SelectVehicle" component={SelectVehicleScreen} />
        <Stack.Screen
          name="VehicleInspection"
          component={VehicleInspectionScreen}
        />
        <Stack.Screen name="HandoverReport" component={HandoverReportScreen} />
        <Stack.Screen
          name="HandoverReceiptReport"
          component={HandoverReceiptReportScreen}
        />
        <Stack.Screen
          name="AwaitingApproval"
          component={AwaitingApprovalScreen}
        />
        <Stack.Screen
          name="HandoverDocument"
          component={HandoverDocumentScreen}
        />
        <Stack.Screen
          name="HandoverComplete"
          component={HandoverCompleteScreen}
        />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
        <Stack.Screen
          name="MotorbikeDetail"
          component={MotorbikeDetailScreen}
        />
        <Stack.Screen
          name="VehicleConfirmation"
          component={VehicleConfirmationScreen}
        />
        <Stack.Screen
          name="ReturnInspection"
          component={ReturnInspectionScreen}
        />
        <Stack.Screen name="AIAnalysis" component={AIAnalysisScreen} />
        <Stack.Screen
          name="ManualInspection"
          component={ManualInspectionScreen}
        />
        <Stack.Screen name="AdditionalFees" component={AdditionalFeesScreen} />
        <Stack.Screen name="ReturnReport" component={ReturnReportScreen} />
        <Stack.Screen name="TrackingGPS" component={TrackingGPSScreen} />
        <Stack.Screen name="ScanFace" component={ScanFaceScreen} />
        <Stack.Screen name="FaceScanCamera" component={FaceScanCameraScreen} />
        <Stack.Screen
          name="BookingReturnList"
          component={BookingReturnListScreen}
        />
        <Stack.Screen
          name="RentedVehicleDetails"
          component={RentedVehicleDetailsScreen}
        />
        <Stack.Screen
          name="AllVehicles"
          component={StaffVehicleListScreen}
        />
        <Stack.Screen name="TicketList" component={TicketListScreen} />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
        <Stack.Screen
          name="ChargingListBooking"
          component={ChargingListBookingScreen}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
