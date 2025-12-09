/**
 * @fileoverview Custom hook for handling password reset flow
 * @module features/account/presentation/store/hooks/passwords/useResetPassword
 * 
 * This hook encapsulates password reset business logic:
 * - OTP verification and new password submission
 * - Password validation
 * - Success navigation to login
 * - Error handling with Toast notifications
 * 
 * @author eMotoRent Development Team
 * @created 2025
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';

/**
 * Navigation prop type for ResetPasswordScreen
 */
type ResetPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ResetPassword'
>;

/**
 * Reset password form data structure
 * 
 * @interface ResetPasswordData
 * @property {string} otpCode - OTP code sent to user's email
 * @property {string} newPassword - New password to set
 * @property {string} confirmPassword - Password confirmation
 */
interface ResetPasswordData {
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Return type of the useResetPassword hook
 * 
 * @interface UseResetPasswordReturn
 * @property {boolean} loading - Indicates if reset request is in progress
 * @property {string} error - Error message to display (empty string if no error)
 * @property {Function} resetPassword - Function to execute password reset
 * @property {Function} clearError - Function to clear error state
 */
interface UseResetPasswordReturn {
  loading: boolean;
  error: string;
  resetPassword: (email: string, data: ResetPasswordData) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing password reset flow
 * 
 * Handles the complete password reset process:
 * 1. Validates OTP code and new password
 * 2. Submits reset request to backend
 * 3. Shows success notification
 * 4. Navigates to login on success
 * 5. Handles errors with user-friendly messages
 * 
 * @returns {UseResetPasswordReturn} Reset password state and methods
 * 
 * @example
 */
export const useResetPassword = (): UseResetPasswordReturn => {
    const navigation = useNavigation<ResetPasswordScreenNavigationProp>();

    // ==================== STATE ====================
    
    /** Indicates if reset request is in progress */
    const [loading, setLoading] = useState<boolean>(false);
    
    /** Current error message (empty if no error) */
    const [error, setError] = useState<string>('');

    // ==================== HANDLERS ====================

    /**
     * Executes password reset with OTP verification
     * 
     * Flow:
     * 1. Validates form data (OTP, password, confirmation)
     * 2. Calls reset password API with email, OTP, and new password
     * 3. Shows success toast on completion
     * 4. Navigates to login screen
     * 5. Shows error toast on failure
     * 
     * @param {string} email - Email address for password reset
     * @param {ResetPasswordData} data - Reset password form data
     * @returns {Promise<void>}
     */
    const resetPassword = useCallback(
        async (email: string, data: ResetPasswordData): Promise<void> => {
        try {
            setLoading(true);
            setError('');

            console.log('[useResetPassword] Attempting password reset:', { email });

            // ==================== API CALL ====================
            // Execute password reset via ServiceContainer
            const response = await container.account.passwords.reset.execute(
            email,
            data.otpCode,
            data.newPassword,
            data.confirmPassword
            );

            // ==================== SUCCESS HANDLING ====================
            if (response.success) {
            console.log('[useResetPassword] Password reset successful');

            // Show success notification
            Toast.show({
                type: 'success',
                text1: 'Đặt lại mật khẩu thành công',
                text2: 'Vui lòng đăng nhập lại',
            });

            // Navigate to login screen
            navigation.navigate('Login');
            } else {
            // Backend returned success: false
            const errorMessage = response.message || 'Không thể đặt lại mật khẩu';
            setError(errorMessage);

            Toast.show({
                type: 'error',
                text1: 'Đặt lại mật khẩu thất bại',
                text2: errorMessage,
            });
            }

        } catch (err: any) {
            // ==================== ERROR HANDLING ====================
            const errorMessage = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);

            Toast.show({
            type: 'error',
            text1: 'Đặt lại mật khẩu thất bại',
            text2: errorMessage,
            });

            console.error('[useResetPassword] Reset password error:', {
            message: errorMessage,
            email: email,
            error: err,
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
     * Use this when user dismisses error message or retries.
     */
    const clearError = useCallback(() => {
        setError('');
    }, []);

    // ==================== RETURN ====================

    return {
        loading,
        error,
        resetPassword,
        clearError,
    };
};