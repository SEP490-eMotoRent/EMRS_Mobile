/**
 * @fileoverview OTP verification screen for email confirmation
 * @module features/account/presentation/pages/otp/OTPVerificationScreen
 * 
 * This screen provides the OTP verification interface including:
 * - 6-digit OTP code input
 * - OTP resend functionality
 * - Already-verified email detection
 * - Success navigation to login
 * - Separate error handling for verify and resend operations
 * 
 * @author eMotoRent Development Team
 * @created 2025
 */

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { colors } from '../../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';

// ==================== ATOMIC COMPONENTS ====================
import { BrandTitle } from '../../atoms/BrandTitle';

// ==================== ORGANISM COMPONENTS ====================
import { OTPForm } from '../../organism/otp/OTPForm';

// ==================== CUSTOM HOOKS ====================
import { useOtpScreen } from '../../../store/hooks/otp/useOtpScreen';

/**
 * Navigation prop type for OTPVerificationScreen
 */
type OTPVerificationScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'OTPVerification'
>;

/**
 * Route prop type for OTPVerificationScreen
 * Contains email and userId parameters from registration or login
 */
type OTPVerificationScreenRouteProp = RouteProp<
    AuthStackParamList,
    'OTPVerification'
>;

/**
 * OTPVerificationScreen Component
 * 
 * Email verification screen that orchestrates the complete OTP flow:
 * 
 * Features:
 * - 6-digit OTP code input with auto-focus
 * - OTP verification with backend
 * - Resend OTP functionality with cooldown
 * - Already-verified email detection
 * - Success navigation to login
 * - Separate error states for verify and resend
 * - User-friendly error messages
 * 
 * Verification Flow:
 * 1. User arrives from RegisterScreen with email and userId
 * 2. User receives OTP code via email
 * 3. User enters 6-digit code
 * 4. Hook verifies code with backend
 * 5. Success: User redirected to login
 * 6. Failure: User sees error and can resend
 * 
 * @component
 * @returns {React.ReactElement} OTPVerificationScreen component
 */
export const OTPVerificationScreen: React.FC = () => {
    // ==================== NAVIGATION & ROUTING ====================
    const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
    const route = useRoute<OTPVerificationScreenRouteProp>();
    const { email, userId } = route.params;

    // ==================== CUSTOM HOOKS ====================
    
    /**
     * OTP screen hook - handles all OTP verification business logic
     * Provides: verify/resend functions, separate error states, loading states
     */
    const {
        loading,
        resending,
        verifyError,
        resendError,
        verifyOtp,
        resendOtp,
        clearErrors,
    } = useOtpScreen();

    // ==================== EVENT HANDLERS ====================

    /**
     * Handles OTP code verification
     * 
     * Flow:
     * 1. User enters 6-digit code
     * 2. Hook validates and sends to backend
     * 3. On success, hook navigates to login
     * 4. On failure, hook shows error message
     * 
     * @param {string} code - 6-digit OTP code entered by user
     * @returns {Promise<void>}
     * 
     * @async
     */
    const handleVerify = useCallback(
        async (code: string): Promise<void> => {
        await verifyOtp(email, code);
        // Hook handles success navigation and error display
        },
        [email, verifyOtp]
    );

    /**
     * Handles OTP code resend
     * 
     * Flow:
     * 1. User clicks "Resend OTP" button
     * 2. Hook sends resend request to backend
     * 3. On success, hook shows success toast
     * 4. On failure, hook shows error message
     * 
     * @returns {Promise<void>}
     * 
     * @async
     */
    const handleResend = useCallback(async (): Promise<void> => {
        await resendOtp(email);
        // Hook handles success toast and error display
    }, [email, resendOtp]);

    /**
     * Navigates back to previous screen
     * 
     * Typically returns to RegisterScreen or LoginScreen
     */
    const handleGoBack = useCallback((): void => {
        navigation.goBack();
    }, [navigation]);

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
            bounces={false}
            keyboardShouldPersistTaps="handled"
            >
            {/* Back navigation button */}
            <BackButton onPress={handleGoBack} />

            {/* Brand header with subtitle */}
            <BrandTitle subtitle="Xác minh địa chỉ email của bạn" />

            {/* OTP input form with verify and resend */}
            <OTPForm
                onVerify={handleVerify}
                onResend={handleResend}
                loading={loading}
                resending={resending}
                email={email}
                verifyError={verifyError}
                resendError={resendError}
                onErrorDismiss={clearErrors}
            />
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
 * - Spacing: 20px top, 40px bottom
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
     * Ensures content is accessible when keyboard appears
     */
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
});