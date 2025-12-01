import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import sl from "../../../../../../core/di/InjectionContainer";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { LoginResponseData } from "../../../../../../data/models/account/accountDTO/LoginResponse";
import { LoginUseCase } from "../../../../../../domain/usecases/account/LoginUseCase";
import { colors } from "../../../../../common/theme/colors";
import { AuthStackParamList, RootStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useAppDispatch } from "../../../store/hooks";
import { addAuth } from "../../../store/slices/authSlice";
import { BrandTitle } from "../../atoms/BrandTitle";
import { EmailPromptModal } from "../../atoms/OTPVerify/EmailPromptModal";
import { PrivacyNotice } from "../../atoms/PrivacyNotice";
import { SignUpPrompt } from "../../atoms/register/SignUpPrompt";
import { SocialAuthGroup } from "../../atoms/SocialAuthGroup";
import { LoginForm } from "../../organism/login/LoginForm";

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
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingUsername, setPendingUsername] = useState('');
  const [resendingOtp, setResendingOtp] = useState(false);

  const handleContinue = async (data: {
    username: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      const loginUseCase = new LoginUseCase(sl.get("AccountRepository"));
      const response = await loginUseCase.execute({
        username: data.username,
        password: data.password,
      });

      const loginData: LoginResponseData = unwrapResponse(response);

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
      const errorMessage = error.message || "Tên đăng nhập hoặc mật khẩu không đúng";
      
      if (isUnverifiedEmailError(errorMessage)) {
        setPendingUsername(data.username);
        Alert.alert(
          'Xác minh email',
          'Tài khoản của bạn chưa được xác minh. Vui lòng nhập mã OTP đã gửi đến email của bạn.',
          [
            {
              text: 'Xác minh ngay',
              onPress: () => setShowEmailModal(true),
            },
            {
              text: 'Hủy',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert("Đăng nhập thất bại", errorMessage);
      }
      
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      setResendingOtp(true);
      
      const resendOtpUseCase = sl.getResendOtpUseCase();
      await resendOtpUseCase.execute(email);
      
      setShowEmailModal(false);
      
      Toast.show({
        type: 'info',
        text1: 'Đã gửi mã OTP',
        text2: 'Vui lòng kiểm tra email của bạn',
      });

      navigation.navigate('OTPVerification', {
        email: email,
        userId: pendingUsername,
      });
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi mã OTP');
    } finally {
      setResendingOtp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const googleSignInUseCase = sl.getGoogleSignInUseCase();
      const { idToken, email, name } = await googleSignInUseCase.execute();

      const googleLoginUseCase = sl.getGoogleLoginUseCase();
      const response = await googleLoginUseCase.execute(idToken);

      const loginData: LoginResponseData = unwrapResponse(response);

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
        text2: `Chào mừng ${name}`,
      });

    } catch (error: any) {
      Alert.alert('Đăng nhập Google thất bại', error.message);
      console.error('Google Sign-In error:', error);
    } finally {
      setLoading(false);
    }
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
            loading={loading} 
          />
          
          <SocialAuthGroup onGooglePress={handleGoogleSignIn} />

          <SignUpPrompt onSignUpPress={handleSignUpNow} />

          <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
        </ScrollView>
      </KeyboardAvoidingView>

      <EmailPromptModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
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