import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
// import { OnboardingScreen } from '../../features/authentication/ui/screens/OnboardingScreen';
import { LoginScreen } from '../../features/authentication/ui/screens/LoginScreen';
import { RegisterScreen } from '../../features/authentication/ui/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../../features/authentication/ui/screens/ForgotPasswordScreen';
import { HelloScreen } from '../../features/authentication/ui/screens/HelloScreen';
import { HomeScreen } from '../../features/homepage/ui/screens/HomeScreen';

// Define the parameter list for the stack navigator
export type AuthStackParamList = {
  Hello: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Hello"
      screenOptions={{ headerShown: false }}
      id={undefined}
    >
      <Stack.Screen name="Hello" component={HelloScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
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
