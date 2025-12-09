/**
 * @fileoverview Custom hook for handling user login authentication
 * @module features/account/presentation/store/hooks/logins/useLogin
 * 
 * This hook encapsulates all login-related business logic including:
 * - Username/password authentication
 * - Error handling and classification
 * - Unverified email detection
 * - Redux state management
 * - Navigation handling
 * - Toast notifications
 * 
 * @author eMotoRent Development Team
 * @created 2025
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';
import { unwrapResponse } from '../../../../../../core/network/APIResponse';
import { LoginResponseData } from '../../../../../../data/models/account/accountDTO/LoginResponse';

import { CompositeNavigationProp } from '@react-navigation/native';
import { AuthStackParamList, RootStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useAppDispatch } from '../../hooks';
import { addAuth } from '../../slices/authSlice';
import { 
    isUnverifiedEmailError, 
    DEFAULT_LOGIN_ERROR,
    AuthErrorType,
    classifyAuthError 
} from '../../utils/authErrors';

/**
 * Navigation prop type for LoginScreen
 * Combines AuthStack and RootStack navigation
 */
type LoginScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'Login'>,
    StackNavigationProp<RootStackParamList>
>;

/**
 * Login credentials required for authentication
 * 
 * @interface LoginCredentials
 * @property {string} username - User's username or email
 * @property {string} password - User's password
 */
interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * Return type of the useLogin hook
 *
 * @interface UseLoginReturn
 * @property {boolean} loading - Indicates if login request is in progress
 * @property {string} error - Error message to display (empty string if no error)
 * @property {boolean} needsVerification - True if account requires email verification
 * @property {string} unverifiedUsername - Username of account that needs verification
 * @property {AuthErrorType} errorType - Classified type of the current error
 * @property {Function} login - Function to execute login with credentials
 * @property {Function} clearError - Function to clear error state
 */
interface UseLoginReturn {
    loading: boolean;
    error: string;
    needsVerification: boolean;
    unverifiedUsername: string;
    errorType: AuthErrorType | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    clearError: () => void;
}

/**
 * Custom hook for managing user login flow
 *
 * This hook provides a complete login solution with:
 * - Automatic error classification
 * - Unverified email detection
 * - Redux state updates
 * - Success notifications
 * - Proper error handling
 * 
 * @returns {UseLoginReturn} Login state and methods
 */
export const useLogin = (): UseLoginReturn => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const dispatch = useAppDispatch();

    // ==================== STATE ====================
    
    /** Indicates if login request is in progress */
    const [loading, setLoading] = useState<boolean>(false);
    
    /** Current error message (empty if no error) */
    const [error, setError] = useState<string>('');
    
    /** True if the account needs email verification */
    const [needsVerification, setNeedsVerification] = useState<boolean>(false);
    
    /** Username of account that failed due to unverified email */
    const [unverifiedUsername, setUnverifiedUsername] = useState<string>('');
    
    /** Classified type of current error */
    const [errorType, setErrorType] = useState<AuthErrorType | null>(null);

    // ==================== HANDLERS ====================

    /**
     * Executes user login with provided credentials
     * 
     * This method:
     * 1. Validates and sends login request to backend
     * 2. Unwraps and processes response data
     * 3. Updates Redux store with authentication data
     * 4. Shows success notification
     * 5. Handles errors and classifies them appropriately
     * 6. Detects unverified email scenarios
     * 
     * @param {LoginCredentials} credentials - User's login credentials
     * @throws {Error} Re-throws error if account needs verification (to be caught by screen)
     * 
     * @example
     * ```typescript
     * try {
     *   await login({ username: 'user@example.com', password: 'password123' });
     * } catch (error) {
     *   if (needsVerification) {
     *     // Handle verification flow
     *   }
     * }
     * ```
     */
    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        try {
        // Reset error states
        setLoading(true);
        setError('');
        setNeedsVerification(false);
        setUnverifiedUsername('');
        setErrorType(null);

        // Execute login via repository
        const response = await container.account.repository.login(
            credentials.username,
            credentials.password
        );

        // Unwrap API response
        const loginData: LoginResponseData = unwrapResponse(response);

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

        // Show success notification
        Toast.show({
            type: "success",
            text1: "Đăng nhập thành công",
            text2: "Chào mừng bạn đến với eMotoRent",
        });

        // Navigation is handled automatically by auth state change in root navigator
        } catch (error: any) {
        // Extract error message
        const errorMessage = error.message || DEFAULT_LOGIN_ERROR;
        
        // Classify error type
        const errorClassification = classifyAuthError(errorMessage);
        setErrorType(errorClassification);
        
        // Handle unverified email scenario
        if (errorClassification === AuthErrorType.UNVERIFIED_EMAIL) {
            setNeedsVerification(true);
            setUnverifiedUsername(credentials.username);
            setError(errorMessage);
            
            // Re-throw so screen can handle OTP modal
            throw error;
        } 
        
        // Handle account locked scenario
        else if (errorClassification === AuthErrorType.ACCOUNT_LOCKED) {
            setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
        }
        
        // Handle network errors
        else if (errorClassification === AuthErrorType.NETWORK_ERROR) {
            setError("Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.");
        }
        
        // Handle invalid credentials or unknown errors
        else {
            setError(DEFAULT_LOGIN_ERROR);
        }
        
        // Log error for debugging
        console.error("[useLogin] Login error:", {
            type: errorClassification,
            message: errorMessage,
            username: credentials.username,
        });
        } finally {
        setLoading(false);
        }
    }, [dispatch]);

    /**
     * Clears all error states
     * 
     * This method resets:
     * - Error message
     * - Needs verification flag
     * - Unverified username
     * - Error type classification
     * 
     * @example
     * ```typescript
     * <ErrorAlert 
     *   message={error}
     *   onDismiss={clearError}
     * />
     * ```
     */
    const clearError = useCallback(() => {
        setError('');
        setNeedsVerification(false);
        setUnverifiedUsername('');
        setErrorType(null);
    }, []);

    // ==================== RETURN ====================

    return {
        loading,
        error,
        needsVerification,
        unverifiedUsername,
        errorType,
        login,
        clearError,
    };
};