import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AuthNavigator } from './Authentication/AuthNavigator';
import { NavigationBarNavigator } from './HomeNav/NavigationBarNavigator';
import { StaffNavigator } from './StaffNav/StaffNavigator';
import { RootStackParamList } from './StackParameters/types';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      {/* Authentication flow */}
      <Stack.Screen name="Auth" component={AuthNavigator} />

      {/* Main app with bottom tabs (Home, Trip, Battery, Profile) */}
      <Stack.Screen name="Home" component={NavigationBarNavigator} />

      {/* Staff navigation for staff accounts */}
      <Stack.Screen name="Staff" component={StaffNavigator} />
    </Stack.Navigator>
  );
};