import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useAppSelector } from "../../features/authentication/store/hooks";
import { AuthNavigator } from "./Authentication/AuthNavigator";
import { NavigationBarNavigator } from "./HomeNav/NavigationBarNav/NavigationBarNavigator";
import { RootStackParamList } from "./StackParameters/types";
import { StaffNavigator } from "./StaffNav/StaffNavigator";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  return (
    <Stack.Navigator
      id={undefined}
      // initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      {!token ? (
        // ✅ Khi token = null → hiện màn Auth
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {user?.role === "RENTER" && (
            <Stack.Screen name="Home" component={NavigationBarNavigator} />
          )}
          {user?.role === "STAFF" && (
            <Stack.Screen name="Staff" component={StaffNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};
