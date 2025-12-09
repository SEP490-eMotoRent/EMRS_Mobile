/**
 * @fileoverview Authentication error detection utilities
 * @module features/account/presentation/store/utils/authErrors
 * 
 * This module provides utilities for detecting and classifying authentication errors,
 * particularly for identifying unverified email scenarios that require OTP verification.
 * 
 * @author eMotoRent Development Team
 * @created 2024
 */

/**
 * Keywords that indicate an unverified email error.
 * These keywords are checked against error messages from the authentication API
 * to determine if the user needs to verify their email via OTP.
 * 
 * @constant
 * @type {ReadonlyArray<string>}
 */
const UNVERIFIED_EMAIL_KEYWORDS = [
    'verify your email',
    'verification',
    'otp',
    'chưa xác minh',
    'xác minh email',
] as const;

/**
 * Checks if an error message indicates an unverified email account.
 * 
 * This function performs a case-insensitive search for keywords that typically
 * appear in error messages when a user attempts to login with an unverified account.
 * 
 * @param {string} message - The error message to analyze
 * @returns {boolean} True if the error indicates an unverified email, false otherwise
 * 
 * @example
 * ```typescript
 * const error = "Please verify your email before logging in";
 * if (isUnverifiedEmailError(error)) {
 *   // Show OTP verification modal
 * }
 * ```
 * 
 * @example
 * ```typescript
 * const error = "Email chưa xác minh. Vui lòng kiểm tra email.";
 * if (isUnverifiedEmailError(error)) {
 *   // Show OTP verification modal
 * }
 * ```
 */
export const isUnverifiedEmailError = (message: string): boolean => {
    if (!message || typeof message !== 'string') {
        return false;
    }

    const lowerMessage = message.toLowerCase();
    return UNVERIFIED_EMAIL_KEYWORDS.some(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
    );
};

/**
 * Default error message for failed login attempts.
 * Used when the API returns an error without a specific message.
 * 
 * @constant
 * @type {string}
 */
export const DEFAULT_LOGIN_ERROR = "Tên đăng nhập hoặc mật khẩu không đúng";

/**
 * Default error message for failed Google authentication.
 * Used when Google Sign-In fails without a specific error message.
 * 
 * @constant
 * @type {string}
 */
export const DEFAULT_GOOGLE_ERROR = "Đăng nhập Google thất bại. Vui lòng thử lại.";

/**
 * Error classification types for authentication failures.
 * 
 * @enum {string}
 */
export enum AuthErrorType {
    /** Invalid credentials provided */
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    
    /** Account requires email verification */
    UNVERIFIED_EMAIL = 'UNVERIFIED_EMAIL',
    
    /** Account has been locked or suspended */
    ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
    
    /** Network or server error */
    NETWORK_ERROR = 'NETWORK_ERROR',
    
    /** Unknown error type */
    UNKNOWN = 'UNKNOWN',
    }

    /**
     * Classifies an authentication error based on its message.
     * 
     * @param {string} message - The error message to classify
     * @returns {AuthErrorType} The classified error type
     * 
     * @example
     * ```typescript
     * const errorType = classifyAuthError(error.message);
     * 
     * switch (errorType) {
     *   case AuthErrorType.UNVERIFIED_EMAIL:
     *     // Show OTP modal
     *     break;
     *   case AuthErrorType.INVALID_CREDENTIALS:
     *     // Show error message
     *     break;
     * }
     * ```
     */
    export const classifyAuthError = (message: string): AuthErrorType => {
    if (!message || typeof message !== 'string') {
        return AuthErrorType.UNKNOWN;
    }

    const lowerMessage = message.toLowerCase();

    // Check for unverified email
    if (isUnverifiedEmailError(message)) {
        return AuthErrorType.UNVERIFIED_EMAIL;
    }

    // Check for account locked
    if (lowerMessage.includes('locked') || lowerMessage.includes('suspended') || 
        lowerMessage.includes('bị khóa') || lowerMessage.includes('tạm khóa')) {
        return AuthErrorType.ACCOUNT_LOCKED;
    }

    // Check for network errors
    if (lowerMessage.includes('network') || lowerMessage.includes('timeout') ||
        lowerMessage.includes('kết nối') || lowerMessage.includes('mạng')) {
        return AuthErrorType.NETWORK_ERROR;
    }

    // Check for invalid credentials
    if (lowerMessage.includes('invalid') || lowerMessage.includes('incorrect') ||
        lowerMessage.includes('wrong') || lowerMessage.includes('không đúng') ||
        lowerMessage.includes('sai')) {
        return AuthErrorType.INVALID_CREDENTIALS;
    }

    return AuthErrorType.UNKNOWN;
};