/**
 * @fileoverview Custom hook for handling user registration
 * @module features/account/presentation/store/hooks/register/useRegister
 * 
 * This hook encapsulates registration business logic extracted from RegisterScreen:
 * - Form validation (username, email, password, confirmation)
 * - API registration call
 * - Success navigation to OTP verification
 * - Error handling with Toast notifications
 * 
 * @author eMotoRent Development Team
 * @created 2024
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import {
    DEFAULT_REGISTRATION_ERROR,
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
 * 3. Navigates to OTP verification on success
 * 4. Shows error messages on failure
 * 
 * Uses Toast for error messages (consistent with LoginScreen)
 * instead of Alert.alert from the original implementation.
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
   * 1. Validates form data (comprehensive validation vs original 3 checks)
   * 2. Calls registration API via repository.create()
   * 3. Shows success toast and navigates to OTP screen
   * 4. Shows error toast on failure
   * 
   * @param {RegistrationFormData} data - Complete registration form data
   * @returns {Promise<void>}
   */
  const register = useCallback(
    async (data: RegistrationFormData): Promise<void> => {
      try {
        setLoading(true);
        setError('');

        // ==================== VALIDATION ====================
        // Original had 3 inline checks, now using comprehensive utility
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

        console.log('[useRegister] Validation passed, calling API...');

        // ==================== API CALL ====================
        // Original: new RegisterUseCase(sl.get('AccountRepository')).execute({...})
        // Use case handles creating both Account + Renter entities with proper structure
        const registerUseCase = container.account.useCases.register;
        
        await registerUseCase.execute({
          username: data.username,
          email: data.email,
          password: data.password,
          fullname: '',     // Optional
          phone: '',        // Optional
          address: '',      // Optional
          dateOfBirth: '',  // Optional
          avatarUrl: '',    // Optional
        });

        console.log('[useRegister] Registration successful');

        // ==================== SUCCESS ====================
        // Show success toast (original didn't have this)
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công',
          text2: 'Vui lòng kiểm tra email để xác thực tài khoản',
        });

        // Navigate to OTP verification (same as original)
        navigation.navigate('OTPVerification', {
          email: data.email,
          userId: data.username,
        });

      } catch (error: any) {
        // ==================== ERROR HANDLING ====================
        // Original: Alert.alert('Đăng ký thất bại', error.message || 'Đã xảy ra lỗi')
        // New: Toast.show + error state
        const errorMessage = error.message || DEFAULT_REGISTRATION_ERROR;
        setError(errorMessage);

        Toast.show({
          type: 'error',
          text1: 'Đăng ký thất bại',
          text2: errorMessage,
        });

        // Structured logging (original had basic console.error)
        console.error('[useRegister] Registration error:', {
          message: errorMessage,
          username: data.username,
          email: data.email,
          error: error,
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