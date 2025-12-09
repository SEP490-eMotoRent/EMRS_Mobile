/**
 * @fileoverview Custom hook for handling forgot password flow
 * @module features/account/presentation/store/hooks/passwords/useForgotPassword
 * 
 * This hook encapsulates forgot password business logic:
 * - Email submission for password reset
 * - OTP sending to user's email
 * - Unverified email detection and handling
 * - Automatic OTP resend for unverified accounts
 * - Success navigation to reset password screen
 * - Error handling with Alerts and Toast notifications
 * 
 * @author eMotoRent Development Team
 * @created 2025
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';

/**
 * Navigation prop type for ForgotPasswordScreen
 */
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'ForgotPassword'
>;

/**
 * Return type of the useForgotPassword hook
 * 
 * @interface UseForgotPasswordReturn
 * @property {boolean} loading - Indicates if forgot password request is in progress
 * @property {string} error - Error message to display (empty string if no error)
 * @property {Function} sendResetCode - Function to send password reset code
 * @property {Function} clearError - Function to clear error state
 */
interface UseForgotPasswordReturn {
    loading: boolean;
    error: string;
    sendResetCode: (email: string) => Promise<void>;
    clearError: () => void;
}

/**
 * Keywords that indicate an unverified email error
 * Used to detect if user needs to verify email before resetting password
 */
const UNVERIFIED_EMAIL_KEYWORDS = [
    'verify your email',
    'email first',
    'verification code',
    'not verified',
    'chưa xác minh',
    'xác minh email',
];

/**
 * Detects if error message indicates unverified email
 * 
 * Checks for various variations of "unverified email" messages
 * in both English and Vietnamese.
 * @param {string} message - Error message to check
 * @returns {boolean} True if message indicates unverified email
 */
const isUnverifiedEmailError = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return UNVERIFIED_EMAIL_KEYWORDS.some((keyword) =>
        lowerMessage.includes(keyword)
    );
};

/**
 * Custom hook for managing forgot password flow
 * 
 * Handles the complete forgot password process with special handling
 * for unverified email accounts:
 * 
 * Normal Flow:
 * 1. User enters email
 * 2. Backend sends OTP to email
 * 3. User navigated to reset password screen
 * 
 * Unverified Email Flow:
 * 1. User enters email
 * 2. Backend detects unverified email
 * 3. Hook shows Alert asking if user wants to verify
 * 4. If yes: Resends OTP for verification
 * 5. Navigates to OTP verification screen
 * 
 * @returns {UseForgotPasswordReturn} Forgot password state and methods
 */
export const useForgotPassword = (): UseForgotPasswordReturn => {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

    // ==================== STATE ====================
    
    /** Indicates if forgot password request is in progress */
    const [loading, setLoading] = useState<boolean>(false);
    
    /** Current error message (empty if no error) */
    const [error, setError] = useState<string>('');

    // ==================== HELPERS ====================

    /**
     * Handles unverified email scenario
     * 
     * Shows Alert dialog asking user if they want to verify email.
     * If yes, resends OTP and navigates to OTP verification screen.
     * 
     * @param {string} email - Email address that needs verification
     * @returns {Promise<void>}
     */
    const handleUnverifiedEmail = useCallback(
        async (email: string): Promise<void> => {
        Alert.alert(
            'Email chưa xác minh',
            'Bạn cần xác minh email trước khi đặt lại mật khẩu. Bạn có muốn xác minh ngay không?',
            [
            {
                text: 'Xác minh ngay',
                onPress: async () => {
                try {
                    console.log('[useForgotPassword] Resending OTP for verification:', { email });

                    // Resend OTP for email verification
                    await container.account.otp.resend.execute(email);

                    Toast.show({
                    type: 'info',
                    text1: 'Đã gửi mã OTP xác minh',
                    text2: 'Vui lòng kiểm tra email của bạn',
                    });

                    // Navigate to OTP verification screen
                    navigation.navigate('OTPVerification', {
                    email: email,
                    userId: email, // Use email as userId if username not available
                    });
                } catch (resendErr: any) {
                    Alert.alert('Lỗi', resendErr.message || 'Không thể gửi mã OTP');
                    console.error('[useForgotPassword] Resend OTP error:', resendErr);
                }
                },
            },
            {
                text: 'Hủy',
                style: 'cancel',
            },
            ]
        );
        },
        [navigation]
    );

    // ==================== HANDLERS ====================

    /**
     * Sends password reset code to user's email
     * 
     * Flow:
     * 1. Validates email format
     * 2. Calls forgot password API
     * 3. On success: Shows toast and navigates to reset password screen
     * 4. On unverified email: Shows Alert and offers verification flow
     * 5. On other errors: Shows error message
     * 
     * @param {string} email - Email address to send reset code to
     * @returns {Promise<void>}
     */
    const sendResetCode = useCallback(
        async (email: string): Promise<void> => {
        try {
            setLoading(true);
            setError('');

            console.log('[useForgotPassword] Sending reset code:', { email });

            // ==================== API CALL ====================
            // Execute forgot password via ServiceContainer
            const response = await container.account.passwords.forgot.execute(email);

            // ==================== SUCCESS HANDLING ====================
            if (response.success) {
            console.log('[useForgotPassword] Reset code sent successfully');

            // Show success notification
            Toast.show({
                type: 'success',
                text1: 'Đã gửi mã OTP',
                text2: 'Vui lòng kiểm tra email của bạn',
            });

            // Navigate to reset password screen
            navigation.navigate('ResetPassword', { email });
            } else {
            // ==================== FAILURE HANDLING ====================
            // Backend returned success: false
            const errorMessage = response.message || 'Không thể gửi mã OTP';

            // Check if this is an unverified email error
            if (isUnverifiedEmailError(errorMessage)) {
                await handleUnverifiedEmail(email);
            } else {
                setError(errorMessage);
            }
            }

        } catch (err: any) {
            // ==================== ERROR HANDLING ====================
            const errorMessage = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';

            console.error('[useForgotPassword] Forgot password error:', {
            message: errorMessage,
            email: email,
            error: err,
            });

            // Check if this is an unverified email error
            if (isUnverifiedEmailError(errorMessage)) {
            await handleUnverifiedEmail(email);
            } else {
            setError(errorMessage);

            Toast.show({
                type: 'error',
                text1: 'Gửi mã thất bại',
                text2: errorMessage,
            });
            }
        } finally {
            setLoading(false);
        }
        },
        [navigation, handleUnverifiedEmail]
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
        sendResetCode,
        clearError,
    };
};