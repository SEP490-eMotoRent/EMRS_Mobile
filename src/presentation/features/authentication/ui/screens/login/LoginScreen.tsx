import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../../../common/theme/colors";
import { BrandTitle } from "../../atoms/BrandTitle";
import { EmailPromptModal } from "../../atoms/OTPVerify/EmailPromptModal";
import { PrivacyNotice } from "../../atoms/PrivacyNotice";
import { SignUpPrompt } from "../../atoms/register/SignUpPrompt";
import { SocialAuthGroup } from "../../atoms/SocialAuthGroup";
import { LoginForm } from "../../organism/login/LoginForm";
import { CompositeNavigationProp } from "@react-navigation/native";
import { AuthStackParamList, RootStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useGoogleLogin } from "../../../store/hooks/useGoogleLogin";
import { useLogin } from "../../../store/hooks/useLogin";
import { useOtpVerification } from "../../../store/hooks/useOTPVerification";

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<RootStackParamList>
>;

const UNVERIFIED_EMAIL_KEYWORDS = [
  'verify your email',
  'verification',
  'otp',
  'chưa xác minh',
  'xác minh email',
];

const isUnverifiedEmailError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return UNVERIFIED_EMAIL_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  // Custom hooks
  const { loading: loginLoading, error: loginError, login, clearError } = useLogin();
  const { loading: googleLoading, error: googleError, googleSignIn, clearError: clearGoogleError } = useGoogleLogin();
  const { 
    showEmailModal, 
    pendingUsername, 
    resendingOtp, 
    openEmailModal, 
    closeEmailModal, 
    resendOtp 
  } = useOtpVerification();

  const handleContinue = async (data: { username: string; password: string }) => {
    try {
      await login(data);
    } catch (error: any) {
      const errorMessage = error.message || "Tên đăng nhập hoặc mật khẩu không đúng";
      
      // Check if it's an unverified email error
      if (isUnverifiedEmailError(errorMessage)) {
        openEmailModal(data.username);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  const handleEmailSubmit = async (email: string) => {
    await resendOtp(email);
  };

  const handleSignUpNow = () => {
    navigation.navigate("Register");
  };

  const handlePrivacyPolicy = () => {
    console.log("Privacy policy");
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Combine loading states
  const isLoading = loginLoading || googleLoading;
  
  // Combine error states (prioritize login error)
  const displayError = loginError || googleError;
  const handleErrorDismiss = () => {
    clearError();
    clearGoogleError();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <BrandTitle subtitle="Đăng nhập vào tài khoản eMotoRent của bạn" />

          <LoginForm 
            onContinue={handleContinue} 
            onForgotPassword={handleForgotPassword}
            loading={isLoading}
            error={displayError}
            onErrorDismiss={handleErrorDismiss}
          />
          
          <SocialAuthGroup onGooglePress={handleGoogleSignIn} />

          <SignUpPrompt onSignUpPress={handleSignUpNow} />

          <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
        </ScrollView>
      </KeyboardAvoidingView>

      <EmailPromptModal
        visible={showEmailModal}
        onClose={closeEmailModal}
        onSubmit={handleEmailSubmit}
        loading={resendingOtp}
      />
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
    paddingTop: 40,
    paddingBottom: 20,
  },
});