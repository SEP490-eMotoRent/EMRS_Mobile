import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
// import { OnboardingScreen } from '../../features/authentication/ui/screens/OnboardingScreen';
import { LoginScreen } from '../../features/authentication/ui/screens/LoginScreen';
import { RegisterScreen } from '../../features/authentication/ui/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../../features/authentication/ui/screens/ForgotPasswordScreen';
import { HelloScreen } from '../../features/authentication/ui/screens/HelloScreen';

// Define the parameter list for the stack navigator
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
      id={undefined}
    >
      <Stack.Screen name="Onboarding" component={HelloScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
