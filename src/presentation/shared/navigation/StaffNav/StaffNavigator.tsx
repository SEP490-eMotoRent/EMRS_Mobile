import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  StaffBottomNavigationBar,
  StaffNavRoute,
} from "../../../common/components/organisms/StaffBottomNavigationBar";
import { ProfileNavigator } from "../HomeNav/ProfileNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import { StaffStackParamList } from "../StackParameters/types";
import {
  HandoverScreen,
  ReturnScreen,
  ScanFaceScreen,
  ScanResultScreen,
  CustomerRentalsScreen,
  BookingDetailsScreen,
  SelectVehicleScreen,
  VehicleInspectionScreen,
  HandoverReportScreen,
  AwaitingApprovalScreen,
  HandoverDocumentScreen,
  HandoverCompleteScreen,
} from "../../../features/staff/handover/ui/screens";
import { ChargingScreen } from "../../../features/staff/charging/ui/screens";
import { StaffHomeScreen, MotorbikeDetailScreen } from "../../../features/staff/home/ui/screens";
import { StaffProfileScreen } from "../../../features/staff/profile/ui/screens";
import { TransferScreen } from "../../../features/staff/transfer/ui/screens";

const Stack = createStackNavigator<StaffStackParamList>();

export const StaffNavigator: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<StaffNavRoute>("home");

  const renderScreen = () => {
    switch (activeRoute) {
      case "home":
        return <StaffHomeScreen />;
      case "transfer":
        return <TransferScreen />;
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
        initialRouteName="Handover"
      >
        <Stack.Screen name="Handover">
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
        <Stack.Screen name="MotorbikeDetail" component={MotorbikeDetailScreen} />
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
