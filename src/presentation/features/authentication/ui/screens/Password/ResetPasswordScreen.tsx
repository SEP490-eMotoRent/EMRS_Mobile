/**
 * @fileoverview Reset password screen with OTP verification
 * @module features/account/presentation/pages/password/ResetPasswordScreen
 * 
 * This screen provides the password reset interface including:
 * - OTP code input field
 * - New password input fields
 * - Password confirmation validation
 * - Navigation back to login
 * 
 * @author eMotoRent Development Team
 * @created 2025
 */

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
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
import { ResetPasswordForm } from '../../organism/password/ResetPasswordForm';
import { useResetPassword } from '../../../store/hooks/password/useResetPassword';

// ==================== CUSTOM HOOKS ====================

/**
 * Navigation prop type for ResetPasswordScreen
 */
type ResetPasswordScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'ResetPassword'
>;

/**
 * Route prop type for ResetPasswordScreen
 * Contains email parameter from ForgotPasswordScreen
 */
type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

/**
 * Reset password form data structure
 * 
 * @interface ResetPasswordFormData
 * @property {string} otpCode - OTP code sent to user's email
 * @property {string} newPassword - New password to set
 * @property {string} confirmPassword - Password confirmation
 */
interface ResetPasswordFormData {
    otpCode: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * ResetPasswordScreen Component
 * 
 * Password reset screen that orchestrates the complete reset flow:
 * 
 * Features:
 * - OTP code verification
 * - New password input with validation
 * - Password confirmation matching
 * - Error handling with user-friendly messages
 * - Success navigation to login
 * - Back navigation to forgot password
 * 
 * Reset Flow:
 * 1. User receives email from ForgotPasswordScreen
 * 2. User enters OTP code from email
 * 3. User enters and confirms new password
 * 4. Hook validates and submits to backend
 * 5. Success: User redirected to login
 * 6. Error: User-friendly message displayed
 * 
 * @component
 * @returns {React.ReactElement} ResetPasswordScreen component
 */
    export const ResetPasswordScreen: React.FC = () => {
    // ==================== NAVIGATION & ROUTING ====================
    const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
    const route = useRoute<ResetPasswordScreenRouteProp>();
    const { email } = route.params;

    // ==================== CUSTOM HOOKS ====================
    
    /**
     * Reset password hook - handles all password reset business logic
     * Provides: loading state, error handling, reset execution
     */
    const { loading, error, resetPassword, clearError } = useResetPassword();

    // ==================== EVENT HANDLERS ====================

    /**
     * Handles reset password form submission
     * 
     * Flow:
     * 1. Hook validates OTP and password
     * 2. If valid, calls reset password API
     * 3. On success, hook navigates to login
     * 4. On failure, hook shows error message
     * 
     * @param {ResetPasswordFormData} data - Reset password form data
     * @returns {Promise<void>}
     * 
     * @async
     */
    const handleSubmit = useCallback(
        async (data: ResetPasswordFormData): Promise<void> => {
        await resetPassword(email, data);
        // Hook handles success navigation and error display
        },
        [email, resetPassword]
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
     * Typically returns to ForgotPasswordScreen
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
                title="Đặt lại mật khẩu"
                subtitle="Nhập mã OTP và mật khẩu mới"
            />

            {/* Reset password form with OTP and password inputs */}
            <ResetPasswordForm
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