/**
 * @fileoverview Registration form validation utilities
 * @module features/account/presentation/store/utils/registrationValidation
 * 
 * This module provides validation utilities for user registration including:
 * - Username validation
 * - Email validation
 * - Password strength validation
 * - Password confirmation matching
 * - Complete form validation
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
    
    /** Maximum username length */
    MAX_USERNAME_LENGTH: 20,
    
    /** Minimum password length */
    MIN_PASSWORD_LENGTH: 6,
    
    /** Maximum password length */
    MAX_PASSWORD_LENGTH: 50,
    
    /** Email regex pattern */
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    /** Username pattern (alphanumeric + underscore) */
    USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
} as const;

/**
 * Validates username format and length
 * 
 * Rules:
 * - Must be 3-20 characters long
 * - Can only contain letters, numbers, and underscores
 * - Cannot be empty or only whitespace
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

    return { isValid: true, error: '' };
};

/**
 * Validates email format
 * 
 * Uses a standard email regex pattern to validate format.
 * Does not verify if the email actually exists.
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

    // Check format
    if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
        return {
        isValid: false,
        error: 'Email không hợp lệ',
        };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates password strength
 * 
 * Rules:
 * - Must be 6-50 characters long
 * - Cannot be empty or only whitespace
 * 
 * Note: Add additional complexity rules (uppercase, numbers, special chars)
 * as needed for enhanced security.
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

    // Check minimum length
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
 * 1. Username validation
 * 2. Email validation
 * 3. Password validation
 * 4. Password confirmation validation
 * 
 * Returns the first validation error encountered,
 * or success if all validations pass.
 * 
 * @param {RegistrationFormData} data - Complete registration form data
 * @returns {ValidationResult} Validation result with first error found, or success
 */
    export const validateRegistrationForm = (
        data: RegistrationFormData
    ): ValidationResult => {
    // Validate username
    const usernameResult = validateUsername(data.username);
    if (!usernameResult.isValid) {
        return usernameResult;
    }

    // Validate email
    const emailResult = validateEmail(data.email);
    if (!emailResult.isValid) {
        return emailResult;
    }

    // Validate password
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