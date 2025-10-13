import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootNavigator } from "./src/presentation/shared/navigation/RootNavigator";
import { AuthProvider } from './src/presentation/features/authentication/notifiers/AuthContext';

export default function App() {
  return (
  <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FFFFFF" style="light" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
    </GestureHandlerRootView>
  </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
