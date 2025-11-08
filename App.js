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

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#FFFFFF" style="light" />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </GestureHandlerRootView>
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
