/**
 * @fileoverview Forgot password screen for password recovery
 * @module features/account/presentation/pages/password/ForgotPasswordScreen
 * 
 * This screen provides the password recovery interface including:
 * - Email input for password reset
 * - OTP sending to user's email
 * - Unverified email detection and handling
 * - Navigation to reset password screen
 * - Navigation back to login
 * 
 * @author eMotoRent Development Team
 * @created 2025
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
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { PageTitle } from '../../../../../common/components/molecules/PageTitle';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';

// ==================== MOLECULE COMPONENTS ====================
import { BackToLogin } from '../../molecules/BackToLogin';

// ==================== ORGANISM COMPONENTS ====================
import { ForgotPasswordForm } from '../../organism/password/ForgotPasswordForm';
import { useForgotPassword } from '../../../store/hooks/password/useForgotPassword';

// ==================== CUSTOM HOOKS ====================

/**
 * Navigation prop type for ForgotPasswordScreen
 */
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

/**
 * ForgotPasswordScreen Component
 * 
 * Password recovery screen that orchestrates the complete forgot password flow:
 * 
 * Features:
 * - Email input with validation
 * - OTP sending to user's email
 * - Unverified email detection with Alert dialog
 * - Automatic OTP resend for unverified accounts
 * - Success navigation to reset password screen
 * - Error handling with user-friendly messages
 * - Back navigation to login
 * 
 * Password Recovery Flow:
 * 1. User enters email address
 * 2. Hook validates and sends to backend
 * 3. Backend sends OTP to email
 * 4. User navigated to reset password screen
 * 
 * Unverified Email Flow:
 * 1. User enters unverified email
 * 2. Backend returns unverified error
 * 3. Hook shows Alert asking if user wants to verify
 * 4. If yes: Resends OTP for verification
 * 5. Navigates to OTP verification screen
 * 
 * @component
 * @returns {React.ReactElement} ForgotPasswordScreen component
 * 
 * @example
 * ```typescript
 * // In navigation stack
 * <Stack.Screen 
 *   name="ForgotPassword" 
 *   component={ForgotPasswordScreen}
 *   options={{ headerShown: false }}
 * />
 * ```
 */
export const ForgotPasswordScreen: React.FC = () => {
  // ==================== NAVIGATION ====================
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  // ==================== CUSTOM HOOKS ====================
  
  /**
   * Forgot password hook - handles all password recovery business logic
   * Provides: loading state, error handling, reset code sending, unverified email detection
   */
  const { loading, error, sendResetCode, clearError } = useForgotPassword();

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles forgot password form submission
   * 
   * Flow:
   * 1. Hook validates email
   * 2. If valid, calls forgot password API
   * 3. On success, hook navigates to reset password screen
   * 4. On unverified email, hook shows Alert and offers verification
   * 5. On other failure, hook shows error message
   * 
   * @param {string} email - Email address for password reset
   * @returns {Promise<void>}
   * 
   * @async
   */
  const handleSubmit = useCallback(
    async (email: string): Promise<void> => {
      await sendResetCode(email);
      // Hook handles all navigation and error scenarios
    },
    [sendResetCode]
  );

  /**
   * Navigates back to login screen
   * 
   * Triggered when user clicks "Back to login" link
   */
  const handleBackToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  /**
   * Navigates back to previous screen
   * 
   * Typically returns to LoginScreen
   */
  const handleGoBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  // ==================== RENDER ====================

  return (
    <SafeAreaView style={styles.container}>
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
          {/* Back navigation button */}
          <BackButton onPress={handleGoBack} />

          {/* Page header with instructions */}
          <PageTitle
            title="Quên mật khẩu"
            subtitle="Đặt lại mật khẩu của bạn"
          />

          {/* Forgot password form with email input */}
          <ForgotPasswordForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            onErrorDismiss={clearError}
          />

          {/* Link back to login screen */}
          <BackToLogin onPress={handleBackToLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
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