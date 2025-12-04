import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ConfirmRentalDurationScreen } from '../../../../features/booking/ui/screens/phase1/ConfirmRentalDurationScreen ';
import { InsurancePlansScreen } from '../../../../features/booking/ui/screens/phase2/InsurancePlansScreen';
import { PaymentConfirmationScreen } from '../../../../features/booking/ui/screens/phase3/PaymentConfirmationScreen';
// import { VNPayCallbackScreen } from '../../../../features/booking/ui/screens/phase3/VNPayCallbackScreen';
import { VNPayWebViewScreen } from '../../../../features/booking/ui/screens/phase3/VNPayWebViewScreen';
import { ZaloPayResultScreen } from '../../../../features/booking/ui/screens/phase3/ZaloPayResultScreen';
import { DigitalContractScreen } from '../../../../features/booking/ui/screens/phase4/DigitalContractScreen';
import { TripsScreen } from '../../../../features/tripListing/ui/screens/TripsScreen';
import { BookingStackParamList } from '../../StackParameters/types';

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
            <Stack.Screen name="Trips" component={TripsScreen} />
            {/* <Stack.Screen name="VNPayCallback" component={VNPayCallbackScreen} /> */}
            <Stack.Screen name="VNPayWebView" component={VNPayWebViewScreen} />

            <Stack.Screen name="ZaloPayResult" component={ZaloPayResultScreen} />
        </Stack.Navigator>
    );
};