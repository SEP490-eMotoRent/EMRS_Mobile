/**
 * @fileoverview Registration form validation utilities
 * @module features/account/presentation/store/utils/registrationValidation
 * 
 * This module provides validation utilities for user registration including:
 * - Username validation (format, length, characters)
 * - Email validation (format)
 * - Password strength validation (length, complexity)
 * - Password confirmation matching
 * - Complete form validation
 * 
 * IMPORTANT: Uniqueness validation (duplicate username/email) is handled by the backend.
 * The backend will return error: "Email/Username is already in use." if duplicate exists.
 * 
 * @author eMotoRent Development Team
 * @updated 2025-01-11
 */

/**
 * Validation result interface
 * 
 * @interface ValidationResult
 * @property {boolean} isValid - Whether the validation passed
 * @property {string} error - Error message if validation failed (empty if valid)
 */
export interface ValidationResult {
    isValid: boolean;
    error: string;
}

/**
 * Registration form data interface
 * 
 * @interface RegistrationFormData
 * @property {string} username - User's chosen username
 * @property {string} email - User's email address
 * @property {string} password - User's chosen password
 * @property {string} confirmPassword - Password confirmation
 */
export interface RegistrationFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

/**
 * Validation constraints for registration fields
 * These constants define the rules for valid registration data
 * 
 * @constant
 */
export const VALIDATION_RULES = {
    /** Minimum username length */
    MIN_USERNAME_LENGTH: 3,
    
    /** Maximum username length (increased from 20 to 30 for flexibility) */
    MAX_USERNAME_LENGTH: 30,
    
    /** Minimum password length (increased from 6 to 8 for better security) */
    MIN_PASSWORD_LENGTH: 8,
    
    /** Maximum password length */
    MAX_PASSWORD_LENGTH: 50,
    
    /** Email regex pattern */
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    /** 
     * Username pattern (alphanumeric + underscore only)
     * Note: Backend checks uniqueness (case-insensitive)
     */
    USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
    
    /**
     * Password must contain at least one number
     * This adds an extra layer of security beyond just length
     */
    PASSWORD_HAS_NUMBER: /\d/,
} as const;

/**
 * Validates username format and length
 * 
 * Rules:
 * - Must be 3-30 characters long
 * - Can only contain letters (a-z, A-Z), numbers (0-9), and underscores (_)
 * - Cannot be empty or only whitespace
 * - Cannot start with underscore (improves readability)
 * - Cannot end with underscore (improves readability)
 * - Cannot have consecutive underscores (improves readability)
 * 
 * UNIQUENESS: Backend checks if username already exists (case-insensitive)
 * Backend error: "Email/Username is already in use."
 * 
 * @param {string} username - Username to validate
 * @returns {ValidationResult} Validation result with error message if invalid
 */
export const validateUsername = (username: string): ValidationResult => {
    // Check if empty
    if (!username || username.trim().length === 0) {
        return {
            isValid: false,
            error: 'Tên đăng nhập không được để trống',
        };
    }

    // Check minimum length
    if (username.length < VALIDATION_RULES.MIN_USERNAME_LENGTH) {
        return {
            isValid: false,
            error: `Tên đăng nhập phải có ít nhất ${VALIDATION_RULES.MIN_USERNAME_LENGTH} ký tự`,
        };
    }

    // Check maximum length
    if (username.length > VALIDATION_RULES.MAX_USERNAME_LENGTH) {
        return {
            isValid: false,
            error: `Tên đăng nhập không được quá ${VALIDATION_RULES.MAX_USERNAME_LENGTH} ký tự`,
        };
    }

    // Check format (alphanumeric + underscore only)
    if (!VALIDATION_RULES.USERNAME_REGEX.test(username)) {
        return {
            isValid: false,
            error: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
        };
    }

    // Additional rules for better username quality
    if (username.startsWith('_')) {
        return {
            isValid: false,
            error: 'Tên đăng nhập không được bắt đầu bằng dấu gạch dưới',
        };
    }

    if (username.endsWith('_')) {
        return {
            isValid: false,
            error: 'Tên đăng nhập không được kết thúc bằng dấu gạch dưới',
        };
    }

    if (username.includes('__')) {
        return {
            isValid: false,
            error: 'Tên đăng nhập không được chứa hai dấu gạch dưới liên tiếp',
        };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates email format
 * 
 * Uses a standard email regex pattern to validate format.
 * Does not verify if the email actually exists.
 * 
 * UNIQUENESS: Backend checks if email already exists (case-insensitive)
 * Backend error: "Email/Username is already in use."
 * 
 * @param {string} email - Email address to validate
 * @returns {ValidationResult} Validation result with error message if invalid
 */
export const validateEmail = (email: string): ValidationResult => {
    // Check if empty
    if (!email || email.trim().length === 0) {
        return {
            isValid: false,
            error: 'Email không được để trống',
        };
    }

    // Trim email (remove whitespace)
    const trimmedEmail = email.trim();

    // Check format
    if (!VALIDATION_RULES.EMAIL_REGEX.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Địa chỉ email không hợp lệ',
        };
    }

    // Additional check: email should not be too long (reasonable limit)
    if (trimmedEmail.length > 254) { // RFC 5321 standard
        return {
            isValid: false,
            error: 'Địa chỉ email quá dài',
        };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates password strength
 * 
 * Rules:
 * - Must be 8-50 characters long (updated from 6 for better security)
 * - Must contain at least one number (0-9)
 * - Cannot be empty or only whitespace
 * 
 * Enhanced security: Requiring at least one number makes passwords harder to crack
 * 
 * @param {string} password - Password to validate
 * @returns {ValidationResult} Validation result with error message if invalid
 */
export const validatePassword = (password: string): ValidationResult => {
    // Check if empty
    if (!password || password.trim().length === 0) {
        return {
            isValid: false,
            error: 'Mật khẩu không được để trống',
        };
    }

    // Check minimum length (increased to 8 for better security)
    if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
        return {
            isValid: false,
            error: `Mật khẩu phải có ít nhất ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} ký tự`,
        };
    }

    // Check maximum length
    if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
        return {
            isValid: false,
            error: `Mật khẩu không được quá ${VALIDATION_RULES.MAX_PASSWORD_LENGTH} ký tự`,
        };
    }

    // Check for at least one number (enhanced security)
    if (!VALIDATION_RULES.PASSWORD_HAS_NUMBER.test(password)) {
        return {
            isValid: false,
            error: 'Mật khẩu phải chứa ít nhất một chữ số',
        };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates password confirmation matches original password
 * 
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {ValidationResult} Validation result with error message if invalid
 */
export const validatePasswordMatch = (
    password: string,
    confirmPassword: string
): ValidationResult => {
    if (!confirmPassword || confirmPassword.trim().length === 0) {
        return {
            isValid: false,
            error: 'Vui lòng xác nhận mật khẩu',
        };
    }

    if (password !== confirmPassword) {
        return {
            isValid: false,
            error: 'Mật khẩu xác nhận không khớp',
        };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates complete registration form data
 * 
 * Performs all validations in order:
 * 1. Username validation (format, length, characters)
 * 2. Email validation (format)
 * 3. Password validation (length, must have number)
 * 4. Password confirmation validation (must match)
 * 
 * Returns the first validation error encountered,
 * or success if all validations pass.
 * 
 * Note: Uniqueness validation (duplicate username/email) is handled by backend.
 * Backend will return: "Email/Username is already in use." if duplicate found.
 * 
 * @param {RegistrationFormData} data - Complete registration form data
 * @returns {ValidationResult} Validation result with first error found, or success
 */
export const validateRegistrationForm = (
    data: RegistrationFormData
): ValidationResult => {
    // Validate username (format, length, characters)
    const usernameResult = validateUsername(data.username);
    if (!usernameResult.isValid) {
        return usernameResult;
    }

    // Validate email (format)
    const emailResult = validateEmail(data.email);
    if (!emailResult.isValid) {
        return emailResult;
    }

    // Validate password (length, must have number)
    const passwordResult = validatePassword(data.password);
    if (!passwordResult.isValid) {
        return passwordResult;
    }

    // Validate password match
    const passwordMatchResult = validatePasswordMatch(
        data.password,
        data.confirmPassword
    );
    if (!passwordMatchResult.isValid) {
        return passwordMatchResult;
    }

    // All frontend validations passed
    // Backend will check uniqueness and return error if duplicate exists
    return { isValid: true, error: '' };
};

/**
 * Default error message for registration failures
 * Used when the API returns an error without a specific message
 * 
 * @constant
 * @type {string}
 */
export const DEFAULT_REGISTRATION_ERROR = 'Đăng ký thất bại. Vui lòng thử lại.';

/**
 * Maps backend error messages to user-friendly Vietnamese messages
 * 
 * This helps handle specific backend errors with better UX messages
 * Handles partial matches and cleans error messages
 * 
 * @param {string} backendError - Error message from backend
 * @returns {string} User-friendly error message in Vietnamese
 */
export const mapBackendErrorToUserMessage = (backendError: string): string => {
    // Clean the error message (trim, lowercase for matching)
    const cleanError = backendError?.trim().toLowerCase() || '';

    // Check for uniqueness errors (most common)
    if (
        cleanError.includes('email/username is already in use') ||
        cleanError.includes('user/email already in use') ||
        cleanError.includes('already in use')
    ) {
        return 'Tên đăng nhập hoặc email đã được sử dụng';
    }

    // Check for invalid data errors
    if (
        cleanError.includes('invalid user data') ||
        cleanError.includes('invalid data')
    ) {
        return 'Dữ liệu không hợp lệ';
    }

    // Check for membership errors (system error)
    if (
        cleanError.includes('membership not found') ||
        cleanError.includes('default membership')
    ) {
        return 'Lỗi hệ thống. Vui lòng liên hệ hỗ trợ';
    }

    // Check for general errors
    if (cleanError.includes('error occurred')) {
        return 'Đã xảy ra lỗi. Vui lòng thử lại';
    }

    // If no specific match, return default Vietnamese error
    // Don't return the English error - always Vietnamese
    return 'Đăng ký thất bại. Vui lòng thử lại';
};