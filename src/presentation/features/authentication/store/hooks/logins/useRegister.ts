/**
 * @fileoverview Custom hook for handling user registration
 * @module features/account/presentation/store/hooks/register/useRegister
 * 
 * This hook encapsulates registration business logic extracted from RegisterScreen:
 * - Form validation (username, email, password, confirmation)
 * - API registration call
 * - Success navigation to OTP verification
 * - Error handling with Toast notifications
 * - Backend error mapping (uniqueness validation)
 * 
 * @author eMotoRent Development Team
 * @created 2024
 * @updated 2025-01-11
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import {
    DEFAULT_REGISTRATION_ERROR,
    mapBackendErrorToUserMessage,
    RegistrationFormData,
    validateRegistrationForm,
} from '../../utils/registrationValidation';

/**
 * Navigation prop type for RegisterScreen
 */
type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

/**
 * Return type of the useRegister hook
 * 
 * @interface UseRegisterReturn
 * @property {boolean} loading - Indicates if registration request is in progress
 * @property {string} error - Error message to display (empty string if no error)
 * @property {Function} register - Function to execute registration with form data
 * @property {Function} clearError - Function to clear error state
 */
interface UseRegisterReturn {
  loading: boolean;
  error: string;
  register: (data: RegistrationFormData) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing user registration flow
 * 
 * Extracted from original RegisterScreen's handleContinue function.
 * Handles the complete registration flow:
 * 1. Validates form data (username, email, password, confirmation)
 * 2. Calls registration API
 * 3. Backend validates uniqueness (duplicate username/email)
 * 4. Navigates to OTP verification on success
 * 5. Shows error messages on failure (with backend error mapping)
 * 
 * Uses Toast for error messages (consistent with LoginScreen)
 * instead of Alert.alert from the original implementation.
 * 
 * Backend uniqueness validation:
 * - Backend checks if username/email already exists (case-insensitive)
 * - Returns error: "Email/Username is already in use."
 * - This hook maps backend errors to Vietnamese messages
 * 
 * @returns {UseRegisterReturn} Registration state and methods
 * 
 * @example
 * ```typescript
 * const RegisterScreen = () => {
 *   const { loading, error, register, clearError } = useRegister();
 * 
 *   const handleContinue = async (formData) => {
 *     await register(formData);
 *   };
 * 
 *   return (
 *     <RegisterForm 
 *       onContinue={handleContinue}
 *       loading={loading}
 *       error={error}
 *       onErrorDismiss={clearError}
 *     />
 *   );
 * };
 * ```
 */
export const useRegister = (): UseRegisterReturn => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // ==================== STATE ====================
  
  /** Indicates if registration request is in progress */
  const [loading, setLoading] = useState<boolean>(false);
  
  /** Current error message (empty if no error) */
  const [error, setError] = useState<string>('');

  // ==================== HANDLERS ====================

  /**
   * Executes user registration with provided form data
   * 
   * This is the extracted and improved version of the original
   * handleContinue function from RegisterScreen.
   * 
   * Flow:
   * 1. Validates form data (format, length, password strength)
   * 2. Calls registration API via repository.create()
   * 3. Backend validates uniqueness (username/email)
   * 4. Shows success toast and navigates to OTP screen
   * 5. Shows error toast on failure (with backend error mapping)
   * 
   * @param {RegistrationFormData} data - Complete registration form data
   * @returns {Promise<void>}
   */
  const register = useCallback(
    async (data: RegistrationFormData): Promise<void> => {
      try {
        setLoading(true);
        setError('');

        // ==================== FRONTEND VALIDATION ====================
        // Validates format, length, password strength
        // Does NOT check uniqueness (backend handles this)
        const validationResult = validateRegistrationForm(data);
        
        if (!validationResult.isValid) {
          setError(validationResult.error);
          
          // Show validation error (Toast instead of Alert.alert)
          Toast.show({
            type: 'error',
            text1: 'Lỗi xác thực',
            text2: validationResult.error,
          });
          
          return;
        }

        console.log('[useRegister] Frontend validation passed, calling API...');

        // ==================== API CALL ====================
        // Backend will validate:
        // - Username uniqueness (case-insensitive)
        // - Email uniqueness (case-insensitive)
        // - Default membership exists
        const registerUseCase = container.account.useCases.register;
        
        await registerUseCase.execute({
          username: data.username,
          email: data.email,
          password: data.password,
          fullname: '',     // Optional - backend accepts empty string
          phone: '',        // Optional - backend accepts empty string
          address: '',      // Optional - backend accepts empty string
          dateOfBirth: '',  // Optional - backend accepts empty string
          avatarUrl: '',    // Optional - backend accepts empty string
        });

        console.log('[useRegister] Registration successful, navigating to OTP verification...');

        // ==================== SUCCESS ====================
        // Show success toast
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công',
          text2: 'Vui lòng kiểm tra email để xác thực tài khoản',
        });

        // Navigate to OTP verification screen
        navigation.navigate('OTPVerification', {
          email: data.email,
          userId: data.username,
        });

      } catch (error: any) {
        // ==================== ERROR HANDLING ====================
        // Backend errors we handle:
        // 1. "Email/Username is already in use." → uniqueness violation
        // 2. "User/Email already in use." → duplicate check (redundant but exists)
        // 3. "Invalid user data." → validation failed
        // 4. "Default membership not found." → system error
        
        // Extract error message from various error formats
        let backendError = DEFAULT_REGISTRATION_ERROR;
        
        if (error?.response?.data?.message) {
          backendError = error.response.data.message;
        } else if (error?.response?.data?.error) {
          backendError = error.response.data.error;
        } else if (error?.message) {
          backendError = error.message;
        } else if (typeof error === 'string') {
          backendError = error;
        }
        
        console.log('[useRegister] Raw backend error:', backendError);
        
        // Map backend error to user-friendly Vietnamese message
        const userFriendlyError = mapBackendErrorToUserMessage(backendError);
        
        console.log('[useRegister] Mapped Vietnamese error:', userFriendlyError);
        
        setError(userFriendlyError);

        // Show error toast with mapped message
        Toast.show({
          type: 'error',
          text1: 'Đăng ký thất bại',
          text2: userFriendlyError,
        });

        // Structured logging for debugging
        console.error('[useRegister] Registration error:', {
          userMessage: userFriendlyError,
          backendMessage: backendError,
          username: data.username,
          email: data.email,
          fullError: error,
        });
      } finally {
        setLoading(false);
      }
    },
    [navigation]
  );

  /**
   * Clears error state
   * 
   * Use this when user dismisses error message or retries registration.
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // ==================== RETURN ====================

  return {
    loading,
    error,
    register,
    clearError,
  };
};