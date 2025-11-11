import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootNavigator } from "./src/presentation/shared/navigation/RootNavigator";
import { AuthProvider } from "./src/presentation/features/authentication/notifiers/AuthContext";
import { Provider } from "react-redux";
import {
  store,
  persistor,
} from "./src/presentation/features/authentication/store";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import { LocationProvider } from "./src/presentation/features/battery/context/LocationContext";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <LocationProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar backgroundColor="#FFFFFF" style="light" />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </GestureHandlerRootView>
          </LocationProvider>
        </AuthProvider>
      </PersistGate>
      <Toast />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
