// import { createStackNavigator } from '@react-navigation/stack';
// import React from 'react';
// import { AuthNavigator } from './AuthNavigator';
// import { MainNavigator } from './MainTabNavigator';
// import { RootStackParamList } from './types';
// import { ProfileNavigator } from './ProfileNavigator';

// const Stack = createStackNavigator<RootStackParamList>();

// // TODO: Replace with your actual auth state
// const isAuthenticated = false; // <--- Change to true when logged in

// export const RootNavigator: React.FC = () => {
//   return (
//     <Stack.Navigator
//       id="RootStack"
//       screenOptions={{ headerShown: false }}
//     >
//       {isAuthenticated ? (
//         <Stack.Screen name="Home" component={MainNavigator} />
//         <Stack.Screen name="Profile" component={ProfileNavigator} />
//       ) : (
//         <Stack.Screen name="Auth" component={AuthNavigator} />
//       )}
//     </Stack.Navigator>
//   );
// };

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AuthNavigator } from './Authentication/AuthNavigator';
import { NavigationBarNavigator } from './HomeNav/NavigationBarNavigator';
import { ProfileNavigator } from './HomeNav/ProfileNavigator';
import { RootStackParamList } from './StackParameters/types';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      {/* Always show Auth first */}
      <Stack.Screen name="Auth" component={AuthNavigator} />

      {/* After login/register success, navigate to Main (which includes Home, Schedule, etc.) */}
      <Stack.Screen name="Home" component={NavigationBarNavigator} />

      {/* Profile stack is accessible from Main */}
      <Stack.Screen name="Profile" component={ProfileNavigator} />
    </Stack.Navigator>
  );
};
