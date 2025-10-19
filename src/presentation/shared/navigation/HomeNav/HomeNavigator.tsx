import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ConfirmRentalDurationScreen } from '../../../features/booking/ui/screens/phase1/ConfirmRentalDurationScreen ';
import { HomeScreen } from '../../../features/homepage/ui/screens/HomeScreen';
import { MapScreen } from '../../../features/map/ui/screens/MapScreen';
import { ListView } from '../../../features/renterVehicleList/ui/screens/ListViewScreen';
import { VehicleDetailsScreen } from '../../../features/vehicleDetails/ui/screens/VehicleDetailsScreen';
import { HomeStackParamList } from '../StackParameters/types';
import { InsurancePlansScreen } from '../../../features/booking/ui/screens/phase2/InsurancePlansScreen';
import { PaymentConfirmationScreen } from '../../../features/booking/ui/screens/phase3/PaymentConfirmationScreen';
import { DigitalContractScreen } from '../../../features/booking/ui/screens/phase4/DigitalContractScreen';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
    return (
        <Stack.Navigator id={undefined} initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* TODO: Add Schedule and Battery screens when ready */}
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="ListView" component={ListView} />
            <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
            <Stack.Screen name="ConfirmRentalDuration" component={ConfirmRentalDurationScreen} />
            <Stack.Screen name="InsurancePlans" component={InsurancePlansScreen} />
            <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
            <Stack.Screen name="DigitalContract" component={DigitalContractScreen} />
        </Stack.Navigator>
    );
};