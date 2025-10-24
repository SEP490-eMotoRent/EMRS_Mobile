import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ForgotPasswordScreen } from '../../../features/authentication/ui/screens/ForgotPasswordScreen';
import { HelloScreen } from '../../../features/authentication/ui/screens/hello/HelloScreen';
import { LoginScreen } from '../../../features/authentication/ui/screens/login/LoginScreen';
import { OTPVerificationScreen } from '../../../features/authentication/ui/screens/otp/OTPVerificationScreen';
import { AdditionalInfoScreen } from '../../../features/authentication/ui/screens/register/AdditionalInfoScreen';
import { RegisterScreen } from '../../../features/authentication/ui/screens/register/RegisterScreen';
import { AuthStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Hello"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Hello" component={HelloScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen}/>
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen}/>

    </Stack.Navigator>
  );
};

export { AuthStackParamList };

