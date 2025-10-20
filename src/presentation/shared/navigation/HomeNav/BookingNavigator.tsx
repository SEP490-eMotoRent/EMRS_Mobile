import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ConfirmRentalDurationScreen } from '../../../features/booking/ui/screens/phase1/ConfirmRentalDurationScreen ';
import { InsurancePlansScreen } from '../../../features/booking/ui/screens/phase2/InsurancePlansScreen';
import { PaymentConfirmationScreen } from '../../../features/booking/ui/screens/phase3/PaymentConfirmationScreen';
import { DigitalContractScreen } from '../../../features/booking/ui/screens/phase4/DigitalContractScreen';
import { BookingStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<BookingStackParamList>();

export const BookingNavigator: React.FC = () => {
    return (
        <Stack.Navigator 
            id={undefined} 
            initialRouteName="ConfirmRentalDuration" 
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ConfirmRentalDuration" component={ConfirmRentalDurationScreen} />
            <Stack.Screen name="InsurancePlans" component={InsurancePlansScreen} />
            <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
            <Stack.Screen name="DigitalContract" component={DigitalContractScreen} />
        </Stack.Navigator>
    );
};