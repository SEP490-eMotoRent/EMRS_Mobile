// features/authentication/ui/screens/LoginScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { RootStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { LoginForm } from "../../organism/login/LoginForm";
import sl from "../../../../../../core/di/InjectionContainer";
import { LoginUseCase } from "../../../../../../domain/usecases/account/LoginUseCase";
import { colors } from "../../../../../common/theme/colors";
import { BrandTitle } from "../../atoms/BrandTitle";
import { PrivacyNotice } from "../../atoms/PrivacyNotice";
import { SignUpPrompt } from "../../atoms/register/SignUpPrompt";
import { SocialAuthGroup } from "../../atoms/SocialAuthGroup";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { addAuth } from "../../../store/slices/authSlice";
import { useAppDispatch } from "../../../store/hooks";
import { LoginResponseData } from "../../../../../../data/models/account/accountDTO/LoginResponse";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Auth"
>;

// ✅ Define JWT payload structure
interface JWTPayload {
  Id: string;
  UserId: string;
  Username: string;
  Role: string;
  exp: number;
  iat: number;
  nbf: number;
}

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleContinue = async (data: {
    username?: string;
    password?: string;
    phoneNumber?: string;
  }) => {
    // Handle username/password login
    if (data.username && data.password) {
      try {
        setLoading(true);

        const loginUseCase = new LoginUseCase(sl.get("AccountRepository"));
        const response = await loginUseCase.execute({
          username: data.username,
          password: data.password,
        });

        // ✅ Unwrap to get the JWT token string
        const loginData: LoginResponseData  = unwrapResponse(response);

        // ✅ Store auth data in Redux
        dispatch(
          addAuth({
            token: loginData.accessToken,
            user: {
              id: loginData.user.id,
              username: loginData.user.username,
              role: loginData.user.role,
              fullName: loginData.user.fullName,
            },
          })
        );

        console.log("✅ Login successful, auth data stored in Redux Persist");
      } catch (error: any) {
        Alert.alert(
          "Login Failed",
          error.message || "Invalid username or password"
        );
        console.error("❌ Login error:", error);
      } finally {
        setLoading(false);
      }
    }
    // Handle phone number login (TODO: Implement later)
    else if (data.phoneNumber) {
      Alert.alert("Coming Soon", "Phone number login will be available soon!");
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up");
  };

  const handleEmailSignUp = () => {
    console.log("Email sign up");
  };

  const handleSignUpNow = () => {
    // @ts-ignore
    navigation.navigate("Register");
  };

  const handlePrivacyPolicy = () => {
    console.log("Privacy policy");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BackButton onPress={() => navigation.goBack()} />

          <BrandTitle subtitle="Sign in to your eMotoRent Account" />

          <LoginForm onContinue={handleContinue} loading={loading} />

          <SocialAuthGroup
            onGooglePress={handleGoogleSignUp}
            onEmailPress={handleEmailSignUp}
          />

          <SignUpPrompt onSignUpPress={handleSignUpNow} />

          <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
});