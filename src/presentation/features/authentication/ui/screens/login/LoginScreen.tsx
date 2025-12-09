/**
 * @fileoverview Main login screen component for user authentication
 * @module features/account/presentation/pages/login/LoginScreen
 *
 * This screen provides the main authentication interface including:
 * - Username/password login form
 * - Google OAuth sign-in option
 * - Email verification via OTP for unverified accounts
 * - Navigation to registration and password recovery
 * - Privacy policy access
 */

import { useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../../../common/theme/colors";
import { AuthStackParamList, RootStackParamList } from "../../../../../shared/navigation/StackParameters/types";

// ==================== ATOMIC COMPONENTS ====================
import { BrandTitle } from "../../atoms/BrandTitle";
import { EmailPromptModal } from "../../atoms/OTPVerify/EmailPromptModal";
import { PrivacyNotice } from "../../atoms/PrivacyNotice";
import { SignUpPrompt } from "../../atoms/register/SignUpPrompt";
import { SocialAuthGroup } from "../../atoms/SocialAuthGroup";

// ==================== ORGANISM COMPONENTS ====================
import { LoginForm } from "../../organism/login/LoginForm";

// ==================== CUSTOM HOOKS ====================
import { useGoogleLogin } from "../../../store/hooks/logins/useGoogleLogin";
import { useLogin } from "../../../store/hooks/logins/useLogin";
import { useOtpVerification } from "../../../store/hooks/otp/useOTPVerification";

/**
 * Navigation prop type for LoginScreen
 * Combines AuthStack and RootStack navigation capabilities
 * 
 * @typedef {Object} LoginScreenNavigationProp
 */
type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<RootStackParamList>
>;

/**
 * Login form data structure
 * 
 * @interface LoginFormData
 * @property {string} username - User's username or email
 * @property {string} password - User's password
 */
interface LoginFormData {
  username: string;
  password: string;
}

/**
 * LoginScreen Component
 * 
 * Main authentication screen that orchestrates the complete login flow:
 * 
 * Features:
 * - Standard username/password authentication
 * - Google OAuth integration
 * - Automatic OTP verification for unverified accounts
 * - Error handling with user-friendly messages
 * - Navigation to registration and password recovery
 * - Responsive keyboard handling
 * - Smooth scrolling for smaller screens
 * 
 * Authentication Flow:
 * 1. User enters credentials or chooses Google Sign-In
 * 2. Credentials validated by useLogin or useGoogleLogin hook
 * 3. If account unverified, OTP modal automatically appears
 * 4. Success: Redux updated, user redirected to home
 * 5. Error: User-friendly message displayed
 * 
 * @component
 * @returns {React.ReactElement} LoginScreen component
 */
export const LoginScreen: React.FC = () => {
  // ==================== NAVIGATION ====================
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  // ==================== AUTHENTICATION HOOKS ====================
  
  /**
   * Standard login hook - handles username/password authentication
   * Provides: loading state, error handling, verification detection
   */
  const {
    loading: loginLoading,
    error: loginError,
    needsVerification,
    unverifiedUsername,
    login,
    clearError
  } = useLogin();
  
  /**
   * Google authentication hook - handles OAuth flow
   * Provides: loading state, error handling, Google sign-in execution
   */
  const { 
    loading: googleLoading,
    error: googleError,
    googleSignIn,
    clearError: clearGoogleError
  } = useGoogleLogin();
  
  /**
   * OTP verification hook - handles email verification modal
   * Provides: modal state, resend functionality
   */
  const {
    showEmailModal,
    pendingUsername,
    resendingOtp,
    openEmailModal,
    closeEmailModal,
    resendOtp
  } = useOtpVerification();

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handles login form submission
   * Flow:
   * 1. Executes login with credentials
   * 2. Checks if account needs verification
   * 3. If unverified, opens OTP modal automatically
   * 4. If verified, hook handles success (Redux update, navigation)
   * @param {LoginFormData} data - Login credentials from form
   * @returns {Promise<void>}
   * @async
   */
  const handleContinue = useCallback(async (data: LoginFormData): Promise<void> => {
    await login(data);
    
    // Check if account needs email verification
    if (needsVerification && unverifiedUsername) {
      openEmailModal(unverifiedUsername);
    }
  }, [login, needsVerification, unverifiedUsername, openEmailModal]);

  /**
   * Handles Google Sign-In button press
   * Initiates Google OAuth flow which includes:
   * 1. Google account picker
   * 2. Token retrieval
   * 3. Backend authentication
   * 4. Redux state update
   * @returns {Promise<void>}
   * @async
   */
  const handleGoogleSignIn = useCallback(async (): Promise<void> => {
    await googleSignIn();
  }, [googleSignIn]);

  /**
   * Handles email submission in OTP verification modal
   * Resends OTP code to provided email address for verification
   * @param {string} email - Email address to send OTP to
   * @returns {Promise<void>}
   * @async
   */
  const handleEmailSubmit = useCallback(async (email: string): Promise<void> => {
    await resendOtp(email);
  }, [resendOtp]);

  /**
   * Navigates to registration screen
   * Triggered when user clicks "Sign up now" link
   */
  const handleSignUpNow = useCallback((): void => {
    navigation.navigate("Register");
  }, [navigation]);

  /**
   * Handles privacy policy link press
   * TODO: Navigate to privacy policy screen or open webview
   */
  const handlePrivacyPolicy = useCallback((): void => {
    console.log("Privacy policy");
    // TODO: Implement navigation to privacy policy
  }, []);

  /**
   * Navigates to forgot password flow
   * Triggered when user clicks "Forgot password?" link
   */
  const handleForgotPassword = useCallback((): void => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  /**
   * Clears all error states from both login methods
   * Used when user dismisses error alert or starts new attempt
   */
  const handleErrorDismiss = useCallback((): void => {
    clearError();
    clearGoogleError();
  }, [clearError, clearGoogleError]);

  // ==================== COMPUTED VALUES ====================
  
  /**
   * Combined loading state from both authentication methods
   * True if either standard login or Google sign-in is in progress
   */
  const isLoading = useMemo(
    () => loginLoading || googleLoading,
    [loginLoading, googleLoading]
  );
  
  /**
   * Current error message to display
   * Prioritizes standard login error over Google error
   */
  const displayError = useMemo(
    () => loginError || googleError,
    [loginError, googleError]
  );

  // ==================== RENDER ====================
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Keyboard handling for iOS/Android */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand header with subtitle */}
          <BrandTitle subtitle="Đăng nhập vào tài khoản eMotoRent của bạn" />

          {/* Main login form with username/password */}
          <LoginForm 
            onContinue={handleContinue} 
            onForgotPassword={handleForgotPassword}
            loading={isLoading}
            error={displayError}
            onErrorDismiss={handleErrorDismiss}
          />
          
          {/* Social authentication options (Google) */}
          <SocialAuthGroup onGooglePress={handleGoogleSignIn} />

          {/* Registration prompt for new users */}
          <SignUpPrompt onSignUpPress={handleSignUpNow} />

          {/* Privacy policy and terms notice */}
          <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP verification modal for unverified accounts */}
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