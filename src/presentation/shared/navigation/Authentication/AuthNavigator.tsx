import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ForgotPasswordScreen } from '../../../features/authentication/ui/screens/ForgotPasswordScreen';
import { HelloScreen } from '../../../features/authentication/ui/screens/HelloScreen';
import { LoginScreen } from '../../../features/authentication/ui/screens/LoginScreen';
import { RegisterScreen } from '../../../features/authentication/ui/screens/RegisterScreen';
import { AuthStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id="AuthStack"
      initialRouteName="Hello"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Hello" component={HelloScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
