import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";

import MapboxGL from "@rnmapbox/maps";
import { MapboxConfig } from "./src/core/config/MapboxConfig";

import { store, persistor } from "./src/presentation/features/authentication/store";
import { AuthProvider } from "./src/presentation/features/authentication/notifiers/AuthContext";
import { LocationProvider } from "./src/presentation/features/battery/context/LocationContext";
import { RootNavigator } from "./src/presentation/shared/navigation/RootNavigator";
import { configureGoogleSignIn } from "./src/core/config/GoogleSignInConfig";

LogBox.ignoreLogs([
  "ServerException",
  "An error occurred while retrieving vehicles",
  "column v0.vehicle_price does not exist",
  "POSITION:",
]);
MapboxGL.setAccessToken(MapboxConfig.accessToken);
export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <LocationProvider>
            <GestureHandlerRootView style={styles.container}>
              <StatusBar backgroundColor="#FFFFFF" style="light" />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
              <Toast />
            </GestureHandlerRootView>
          </LocationProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});