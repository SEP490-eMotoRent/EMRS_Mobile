import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ConfirmRentalDurationScreen } from '../../../features/booking/ui/screens/phase1/ConfirmRentalDurationScreen ';
import { HomeScreen } from '../../../features/homepage/ui/screens/HomeScreen';
import { MapScreen } from '../../../features/map/ui/screens/MapScreen';
import { ListView } from '../../../features/renterVehicleList/ui/screens/ListViewScreen';
import { VehicleDetailsScreen } from '../../../features/vehicleDetails/ui/screens/VehicleDetailsScreen';
import { HomeStackParamList, TripStackParamList } from '../StackParameters/types';
import { InsurancePlansScreen } from '../../../features/booking/ui/screens/phase2/InsurancePlansScreen';
import { PaymentConfirmationScreen } from '../../../features/booking/ui/screens/phase3/PaymentConfirmationScreen';
import { DigitalContractScreen } from '../../../features/booking/ui/screens/phase4/DigitalContractScreen';
import { TripsScreen } from '../../../features/tripListing/ui/screens/TripsScreen';

const Stack = createStackNavigator<TripStackParamList>();

export const TripNavigator: React.FC = () => {
    return (
        <Stack.Navigator id={undefined} initialRouteName="Trip" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Trip" component={TripsScreen} />
        </Stack.Navigator>
    );
};