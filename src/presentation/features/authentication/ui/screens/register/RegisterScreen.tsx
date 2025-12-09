/**
 * @fileoverview Main registration screen component for new user signup
 * @module features/account/presentation/pages/register/RegisterScreen
 * 
 * This screen provides the user registration interface including:
 * - Registration form (username, email, password)
 * - Form validation with user-friendly error messages
 * - Google OAuth sign-up option (future implementation)
 * - Navigation to login screen for existing users
 * - Privacy policy access
 * 
 * @author eMotoRent Development Team
 * @created 2024
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';

// ==================== ATOMIC COMPONENTS ====================
import { BrandTitle } from '../../atoms/BrandTitle';
import { PrivacyNotice } from '../../atoms/PrivacyNotice';

// ==================== MOLECULE COMPONENTS ====================
import { GoogleAuthButton } from '../../molecules/GoogleAuthButton';
import { SignInPrompt } from '../../molecules/SignInPrompt';

// ==================== ORGANISM COMPONENTS ====================
import { RegisterForm } from '../../organism/register/RegisterForm';

// ==================== CUSTOM HOOKS ====================
import { RegistrationFormData } from '../../../store/utils/registrationValidation';
import { useRegister } from '../../../store/hooks/logins/useRegister';

/**
 * Navigation prop type for RegisterScreen
 * 
 * @typedef {Object} RegisterScreenNavigationProp
 */
type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

/**
 * RegisterScreen Component
 * 
 * Main registration screen that orchestrates the complete signup flow:
 * 
 * Features:
 * - Username, email, and password registration
 * - Client-side form validation
 * - Automatic navigation to OTP verification on success
 * - Google OAuth sign-up option (placeholder)
 * - Easy navigation to login for existing users
 * - Privacy policy access
 * 
 * Registration Flow:
 * 1. User fills registration form
 * 2. Client validates all fields
 * 3. On valid data, calls registration API
 * 4. Success: Navigates to OTP verification screen
 * 5. Failure: Shows user-friendly error message
 * 
 * @component
 * @returns {React.ReactElement} RegisterScreen component
 * 
 * @example
 * ```typescript
 * // In navigation stack
 * <Stack.Screen 
 *   name="Register" 
 *   component={RegisterScreen}
 *   options={{ headerShown: false }}
 * />
 * ```
 */
export const RegisterScreen: React.FC = () => {
  // ==================== NAVIGATION ====================
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // ==================== CUSTOM HOOKS ====================
  
  /**
   * Registration hook - handles all registration business logic
   * Provides: loading state, error handling, registration execution
   */
  const { loading, error, register, clearError } = useRegister();

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles registration form submission
   * 
   * Flow:
   * 1. Hook validates form data
   * 2. If valid, calls registration API
   * 3. On success, hook navigates to OTP screen
   * 4. On failure, hook shows error message
   * 
   * @param {RegistrationFormData} data - Registration form data
   * @returns {Promise<void>}
   * 
   * @async
   */
  const handleContinue = useCallback(
    async (data: RegistrationFormData): Promise<void> => {
      await register(data);
      // Hook handles success navigation and error display
    },
    [register]
  );

  /**
   * Handles Google sign-up button press
   * 
   * TODO: Implement Google OAuth registration flow
   * Currently shows placeholder console log
   */
  const handleGoogleSignUp = useCallback((): void => {
    console.log('[RegisterScreen] Google sign up - not yet implemented');
    // TODO: Implement Google OAuth registration
    // Similar to LoginScreen's useGoogleLogin
  }, []);

  /**
   * Navigates to login screen
   * 
   * Triggered when user clicks "Already have an account? Sign in"
   */
  const handleSignIn = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  /**
   * Handles privacy policy link press
   * 
   * TODO: Navigate to privacy policy screen or open webview
   */
  const handlePrivacyPolicy = useCallback((): void => {
    console.log('[RegisterScreen] Privacy policy');
    // TODO: Implement navigation to privacy policy
  }, []);

  // ==================== RENDER ====================

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Keyboard handling for iOS/Android */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand header with subtitle */}
          <BrandTitle subtitle="Hãy tạo tài khoản eMotoRent của bạn" />

          {/* Main registration form */}
          <RegisterForm 
            onContinue={handleContinue} 
            loading={loading}
            error={error}
            onErrorDismiss={clearError}
          />

          {/* Social authentication options (Google) */}
          <GoogleAuthButton 
            onPress={handleGoogleSignUp} 
            showSeparator={true} 
          />

          {/* Login prompt for existing users */}
          <SignInPrompt onSignInPress={handleSignIn} />

          {/* Privacy policy and terms notice */}
          <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================

/**
 * Component styles
 * 
 * Following eMotoRent design system:
 * - Background: colors.background
 * - Padding: 24px horizontal (consistent with design)
 * - Spacing: 20px top, 40px bottom (more bottom space for keyboard)
 */
const styles = StyleSheet.create({
  /**
   * Main container - fills entire screen
   */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /**
   * Keyboard avoiding view - handles keyboard appearance
   */
  keyboardAvoidingView: {
    flex: 1,
  },

  /**
   * Scroll content container
   * Ensures content is centered and properly spaced
   */
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
});