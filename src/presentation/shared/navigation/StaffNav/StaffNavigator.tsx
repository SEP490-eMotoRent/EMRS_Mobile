import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StaffBottomNavigationBar, StaffNavRoute } from '../../../common/components/organisms/StaffBottomNavigationBar';
import { ProfileNavigator } from '../HomeNav/ProfileNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { StaffStackParamList } from '../StackParameters/types';
import { HandoverScreen, ReturnScreen, ScanFaceScreen, ScanResultScreen, CustomerRentalsScreen, BookingDetailsScreen, SelectVehicleScreen, VehicleInspectionScreen, HandoverReportScreen, AwaitingApprovalScreen, HandoverDocumentScreen, HandoverCompleteScreen } from '../../../features/staff/handover/ui/screens';

const Stack = createStackNavigator<StaffStackParamList>();

export const StaffNavigator: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<StaffNavRoute>('handover');

  const renderScreen = () => {
    switch (activeRoute) {
      case 'handover':
        return <HandoverScreen />;
      case 'return':
        return <ReturnScreen />;
      case 'scanface':
        return <ScanFaceScreen />;
      case 'profile':
        return <ProfileNavigator />;
      default:
        return <HandoverScreen />;
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
              <StaffBottomNavigationBar activeRoute={activeRoute} onNavigate={setActiveRoute} />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="ScanResult" component={ScanResultScreen} />
        <Stack.Screen name="CustomerRentals" component={CustomerRentalsScreen} />
        <Stack.Screen name="SelectVehicle" component={SelectVehicleScreen} />
        <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
        <Stack.Screen name="HandoverReport" component={HandoverReportScreen} />
        <Stack.Screen name="AwaitingApproval" component={AwaitingApprovalScreen} />
        <Stack.Screen name="HandoverDocument" component={HandoverDocumentScreen} />
        <Stack.Screen name="HandoverComplete" component={HandoverCompleteScreen} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
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
