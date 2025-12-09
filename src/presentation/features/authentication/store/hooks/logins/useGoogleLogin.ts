/**
 * @fileoverview Custom hook for handling Google OAuth authentication
 * @module features/account/presentation/store/hooks/logins/useGoogleLogin
 * 
 * This hook encapsulates the complete Google Sign-In flow including:
 * - Google OAuth ID token retrieval
 * - Backend authentication with Google token
 * - Redux state management
 * - Error handling
 * - Success notifications
 * 
 * @author eMotoRent Development Team
 * @created 2025
 */

import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';
import { unwrapResponse } from '../../../../../../core/network/APIResponse';
import { LoginResponseData } from '../../../../../../data/models/account/accountDTO/LoginResponse';
import { useAppDispatch } from '../../hooks';
import { addAuth } from '../../slices/authSlice';
import { DEFAULT_GOOGLE_ERROR } from '../../utils/authErrors';

/**
 * Google Sign-In response data
 * Contains user information from Google OAuth flow
 * 
 * @interface GoogleSignInData
 * @property {string} idToken - Google OAuth ID token for backend verification
 * @property {string} email - User's email from Google account
 * @property {string} name - User's full name from Google account
 */
interface GoogleSignInData {
    idToken: string;
    email: string;
    name: string;
}

/**
 * Return type of the useGoogleLogin hook
 * 
 * @interface UseGoogleLoginReturn
 * @property {boolean} loading - Indicates if Google Sign-In is in progress
 * @property {string} error - Error message to display (empty string if no error)
 * @property {Function} googleSignIn - Function to initiate Google Sign-In flow
 * @property {Function} clearError - Function to clear error state
 */
interface UseGoogleLoginReturn {
    loading: boolean;
    error: string;
    googleSignIn: () => Promise<void>;
    clearError: () => void;
}

/**
 * Custom hook for managing Google OAuth authentication flow
 * 
 * This hook provides a complete Google Sign-In solution with:
 * - Two-step authentication (Google OAuth + Backend verification)
 * - Automatic Redux state updates
 * - Success notifications with user name
 * - Comprehensive error handling
 * 
 * Authentication Flow:
 * 1. User initiates Google Sign-In
 * 2. Google OAuth popup appears
 * 3. User selects Google account
 * 4. Hook receives ID token from Google
 * 5. Hook sends token to backend for verification
 * 6. Backend validates and returns user data
 * 7. Redux store updated with auth data
 * 8. Success notification shown
 * 
 * @returns {UseGoogleLoginReturn} Google login state and methods
 */
export const useGoogleLogin = (): UseGoogleLoginReturn => {
    const dispatch = useAppDispatch();

    // ==================== STATE ====================
    
    /** Indicates if Google Sign-In flow is in progress */
    const [loading, setLoading] = useState<boolean>(false);
    
    /** Current error message (empty if no error) */
    const [error, setError] = useState<string>('');

    // ==================== HANDLERS ====================

    /**
     * Initiates Google Sign-In authentication flow
     * 
     * This method performs a two-step authentication:
     * 
     * Step 1: Google OAuth
     * - Opens Google account picker
     * - User selects account
     * - Receives ID token, email, and name
     * 
     * Step 2: Backend Authentication
     * - Sends Google ID token to backend
     * - Backend verifies token with Google
     * - Returns user data and access token
     * - Updates Redux store
     * - Shows success notification
     * 
     * @throws {Error} Throws error if Google Sign-In fails at any step
     * 
     * @example
     * ```typescript
     * <TouchableOpacity onPress={googleSignIn}>
     *   <Text>Sign in with Google</Text>
     * </TouchableOpacity>
     * ```
     */
    const googleSignIn = useCallback(async (): Promise<void> => {
        try {
        // Reset error state
        setLoading(true);
        setError('');

        // ==================== STEP 1: Google OAuth ====================
        // Trigger Google Sign-In popup and retrieve ID token
        const { idToken, email, name }: GoogleSignInData = 
            await container.account.auth.googleSignIn.execute();

        console.log('[useGoogleLogin] Google OAuth successful:', {
            email,
            name,
            hasToken: !!idToken,
        });

        // ==================== STEP 2: Backend Authentication ====================
        // Send Google ID token to backend for verification
        const response = await container.account.auth.googleLogin.execute(idToken);

        // Unwrap API response
        const loginData: LoginResponseData = unwrapResponse(response);

        console.log('[useGoogleLogin] Backend authentication successful:', {
            userId: loginData.user.id,
            username: loginData.user.username,
        });

        // Update Redux store with authentication data
        dispatch(
            addAuth({
            token: loginData.accessToken,
            user: {
                id: loginData.user.id,
                username: loginData.user.username,
                role: loginData.user.role,
                fullName: loginData.user.fullName,
                branchId: loginData.user.branchId,
                branchName: loginData.user.branchName,
            },
            })
        );

        // Show personalized success notification
        Toast.show({
            type: "success",
            text1: "Đăng nhập thành công",
            text2: `Chào mừng ${name}`,
        });

        // Navigation is handled automatically by auth state change in root navigator
        } catch (error: any) {
        // Extract and set error message
        const errorMessage = error.message || DEFAULT_GOOGLE_ERROR;
        setError(errorMessage);
        
        // Log detailed error for debugging
        console.error('[useGoogleLogin] Google Sign-In error:', {
            message: errorMessage,
            error: error,
            stack: error.stack,
        });

        // Show error toast for better user feedback
        Toast.show({
            type: "error",
            text1: "Đăng nhập thất bại",
            text2: errorMessage,
        });
        } finally {
        setLoading(false);
        }
    }, [dispatch]);

    /**
     * Clears error state
     * 
     * Use this method to dismiss error messages when user
     * acknowledges them or attempts another sign-in.
     * 
     * @example
     * ```typescript
     * <ErrorBanner 
     *   message={error}
     *   onDismiss={clearError}
     * />
     * ```
     */
    const clearError = useCallback(() => {
        setError('');
    }, []);

    // ==================== RETURN ====================

    return {
        loading,
        error,
        googleSignIn,
        clearError,
    };
};