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
import sl from "../../../../../../core/di/InjectionContainer";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { LoginResponseData } from "../../../../../../data/models/account/accountDTO/LoginResponse";
import { LoginUseCase } from "../../../../../../domain/usecases/account/LoginUseCase";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { colors } from "../../../../../common/theme/colors";
import { RootStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useAppDispatch } from "../../../store/hooks";
import { addAuth } from "../../../store/slices/authSlice";
import { BrandTitle } from "../../atoms/BrandTitle";
import { PrivacyNotice } from "../../atoms/PrivacyNotice";
import { SignUpPrompt } from "../../atoms/register/SignUpPrompt";
import { SocialAuthGroup } from "../../atoms/SocialAuthGroup";
import { LoginForm } from "../../organism/login/LoginForm";
import Toast from "react-native-toast-message";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Auth"
>;

// Define JWT payload structure
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

        // Unwrap to get the JWT token string
        const loginData: LoginResponseData  = unwrapResponse(response);

        // Store auth data in Redux
        dispatch(
          addAuth({
            token: loginData.accessToken,
            user: {
              id: loginData.user.id,
              username: loginData.user.username,
              role: loginData.user.role,
              fullName: loginData.user.fullName,
              branchId: loginData.user.branchId,
              branchName: loginData.user.branchName,
            },
          })
        );

        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công",
          text2: "Chào mừng bạn đến với eMotoRent",
        });
      } catch (error: any) {
        Alert.alert(
          "Đăng nhập thất bại",
          error.message || "Tên đăng nhập hoặc mật khẩu không đúng"
        );
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    }
    // Handle phone number login (TODO: Implement later)
    else if (data.phoneNumber) {
      Alert.alert("Sắp ra mắt", "Đăng nhập bằng số điện thoại sẽ sớm có mặt!");
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

          <BrandTitle subtitle="Đăng nhập vào tài khoản eMotoRent của bạn" />

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