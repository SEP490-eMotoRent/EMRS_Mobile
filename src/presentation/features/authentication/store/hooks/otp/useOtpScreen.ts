/**
 * @fileoverview Custom hook for handling OTP verification screen logic
 * @module features/account/presentation/store/hooks/otp/useOtpScreen
 * 
 * This hook encapsulates OTP verification screen business logic:
 * - OTP code verification
 * - OTP resend functionality
 * - Already-verified email detection
 * - Success navigation to login
 * - Separate error states for verify and resend operations
 * 
 * NOTE: This is different from useOtpVerification which handles the
 * email modal popup. This hook is for the dedicated OTP screen.
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
 * Navigation prop type for OTPVerificationScreen
 */
type OTPVerificationScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'OTPVerification'
>;

/**
 * Return type of the useOtpScreen hook
 * 
 * @interface UseOtpScreenReturn
 * @property {boolean} loading - Indicates if OTP verification is in progress
 * @property {boolean} resending - Indicates if OTP resend is in progress
 * @property {string} verifyError - Error message for verification (empty if no error)
 * @property {string} resendError - Error message for resend (empty if no error)
 * @property {Function} verifyOtp - Function to verify OTP code
 * @property {Function} resendOtp - Function to resend OTP code
 * @property {Function} clearErrors - Function to clear all error states
 */
interface UseOtpScreenReturn {
    loading: boolean;
    resending: boolean;
    verifyError: string;
    resendError: string;
    verifyOtp: (email: string, code: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    clearErrors: () => void;
}

/**
 * Detects if error message indicates email is already verified
 * 
 * Checks for various variations of "already verified" messages
 * in both English and Vietnamese.
 * 
 * @param {string} message - Error message to check
 * @returns {boolean} True if message indicates already verified
 */
const isEmailAlreadyVerifiedError = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
        lowerMessage.includes('already verified') ||
        lowerMessage.includes('đã được xác minh') ||
        lowerMessage.includes('đã xác minh')
    );
};

/**
 * Custom hook for managing OTP verification screen
 * 
 * Handles the complete OTP verification flow:
 * 1. User enters OTP code from email
 * 2. Verifies code with backend
 * 3. Shows success message and navigates to login
 * 4. Handles resend OTP requests
 * 5. Detects already-verified emails
 * 6. Provides separate error states for verify and resend
 * 
 * @returns {UseOtpScreenReturn} OTP verification state and methods
 */
export const useOtpScreen = (): UseOtpScreenReturn => {
    const navigation = useNavigation<OTPVerificationScreenNavigationProp>();

    // ==================== STATE ====================
    
    /** Indicates if OTP verification is in progress */
    const [loading, setLoading] = useState<boolean>(false);
    
    /** Indicates if OTP resend is in progress */
    const [resending, setResending] = useState<boolean>(false);
    
    /** Error message for verification operation */
    const [verifyError, setVerifyError] = useState<string>('');
    
    /** Error message for resend operation */
    const [resendError, setResendError] = useState<string>('');

    // ==================== HANDLERS ====================

    /**
     * Verifies OTP code with backend
     * 
     * Flow:
     * 1. Validates OTP code format
     * 2. Sends verification request to backend
     * 3. On success: Shows toast and navigates to login
     * 4. On failure: Shows appropriate error message
     * 5. Detects already-verified emails and shows custom message
     * 
     * @param {string} email - Email address being verified
     * @param {string} code - OTP code entered by user
     * @returns {Promise<void>}
     */
    const verifyOtp = useCallback(
        async (email: string, code: string): Promise<void> => {
        try {
            setLoading(true);
            setVerifyError(''); // Clear previous verification errors

            console.log('[useOtpScreen] Verifying OTP:', { email });

            // ==================== API CALL ====================
            // Execute OTP verification via ServiceContainer
            const response = await container.account.otp.verify.execute(email, code);

            // ==================== SUCCESS HANDLING ====================
            if (response.success) {
            console.log('[useOtpScreen] OTP verification successful');

            // Show success notification
            Toast.show({
                type: 'success',
                text1: 'Xác minh thành công',
                text2: 'Bạn có thể đăng nhập ngay bây giờ!',
            });

            // Navigate to login after short delay for toast visibility
            setTimeout(() => {
                navigation.navigate('Login');
            }, 500);
            }

        } catch (error: any) {
            // ==================== ERROR HANDLING ====================
            const errorMessage = error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';

            // Check if email is already verified
            if (isEmailAlreadyVerifiedError(errorMessage)) {
            setVerifyError(
                'Email này đã được xác minh rồi. Vui lòng đăng ký với email khác hoặc đăng nhập.'
            );
            } else {
            setVerifyError('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
            }

            console.error('[useOtpScreen] OTP verification error:', {
            message: errorMessage,
            email: email,
            error: error,
            });
        } finally {
            setLoading(false);
        }
        },
        [navigation]
    );

    /**
     * Resends OTP code to user's email
     * 
     * Flow:
     * 1. Sends resend request to backend
     * 2. On success: Shows toast notification
     * 3. On failure: Shows appropriate error message
     * 4. Detects already-verified emails and shows custom message
     * 
     * @param {string} email - Email address to send OTP to
     * @returns {Promise<void>}
     */
    const resendOtp = useCallback(async (email: string): Promise<void> => {
        try {
        setResending(true);
        setResendError(''); // Clear previous resend errors

        console.log('[useOtpScreen] Resending OTP:', { email });

        // ==================== API CALL ====================
        // Execute OTP resend via ServiceContainer
        const response = await container.account.otp.resend.execute(email);

        // ==================== SUCCESS HANDLING ====================
        if (response.success) {
            console.log('[useOtpScreen] OTP resend successful');

            // Show success notification
            Toast.show({
            type: 'success',
            text1: 'Đã gửi lại mã',
            text2: 'Vui lòng kiểm tra email của bạn',
            });
        }

        } catch (error: any) {
        // ==================== ERROR HANDLING ====================
        const errorMessage = error.message || 'Không thể gửi lại mã OTP';

        // Check if email is already verified
        if (isEmailAlreadyVerifiedError(errorMessage)) {
            setResendError('Email này đã được xác minh rồi. Vui lòng đăng ký với email khác.');
        } else {
            setResendError('Không thể gửi lại mã. Vui lòng thử lại sau.');
        }

        console.error('[useOtpScreen] Resend OTP error:', {
            message: errorMessage,
            email: email,
            error: error,
        });
        } finally {
        setResending(false);
        }
    }, []);

    /**
     * Clears all error states
     * 
     * Resets both verification and resend error messages.
     * Use this when user dismisses error alerts or tries again.
     */
    const clearErrors = useCallback(() => {
        setVerifyError('');
        setResendError('');
    }, []);

    // ==================== RETURN ====================

    return {
        loading,
        resending,
        verifyError,
        resendError,
        verifyOtp,
        resendOtp,
        clearErrors,
    };
};