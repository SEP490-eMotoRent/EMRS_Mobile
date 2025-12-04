import { ServerException } from "../../../../../core/errors/ServerException";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AppLogger } from "../../../../../core/utils/Logger";
import { GoogleLoginRequest } from "../../../../models/account/accountDTO/GoogleLoginRequest";
import { LoginRequest } from "../../../../models/account/accountDTO/LoginRequest";
import { LoginResponseData } from "../../../../models/account/accountDTO/LoginResponse";
import { ResendOtpRequest } from "../../../../models/account/accountDTO/otp/ResendOtpRequest";
import { VerifyOtpRequest } from "../../../../models/account/accountDTO/otp/VerifyOtpRequest";
import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";
import { ChangePasswordRequest } from "../../../../models/account/password/ChangePasswordRequest";
import { ForgotPasswordRequest } from "../../../../models/account/password/ForgotPasswordRequest";
import { ResetPasswordRequest } from "../../../../models/account/password/ResetPasswordRequest";
import { AccountRemoteDataSource } from "../../../interfaces/remote/account/AccountRemoteDataSource";

export class AccountRemoteDataSourceImpl implements AccountRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly logger = AppLogger.getInstance();

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
    }

    async login(request: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
        try {
            this.logger.info('🔄 Logging in user...');
            
            const response = await this.apiClient.post<ApiResponse<{ accessToken: string; user: any }>>(
                '/auth/login',
                request
            );

            this.logger.info('✅ Login successful');
            
            return {
                success: response.data.success,
                message: response.data.message,
                code: response.data.code,
                data: response.data.data
            };
        } catch (error: any) {
            this.logger.error(`❌ Login failed: ${error.message}`);
            
            // If already a ServerException from interceptor, re-throw it
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Invalid username or password',
                error.response?.status || 401
            );
        }
    }

    async create(request: RegisterUserRequest): Promise<RegisterUserRequest> {
        try {
            this.logger.info('🔄 Creating account via API...');
            
            const response = await this.apiClient.post<RegisterUserRequest>(
                '/auth/register',
                request
            );

            this.logger.info('✅ Account created successfully');
            return response.data;
        } catch (error: any) {
            this.logger.error(`❌ Failed to create account: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Failed to register user',
                error.response?.status || 500
            );
        }
    }

    async verifyOtp(request: VerifyOtpRequest): Promise<ApiResponse<string>> {
        try {
            this.logger.info('🔄 Verifying OTP...');
            
            const response = await this.apiClient.post<ApiResponse<string>>(
                '/auth/verify-otp',
                request
            );

            this.logger.info('✅ OTP verified successfully');
            
            return {
                success: response.data.success,
                message: response.data.message,
                code: response.data.code,
                data: response.data.data
            };
        } catch (error: any) {
            this.logger.error(`❌ OTP verification failed: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'OTP verification failed',
                error.response?.status || 400
            );
        }
    }

    async resendOtp(request: ResendOtpRequest): Promise<ApiResponse<string>> {
        try {
            this.logger.info('🔄 Resending OTP...');
            
            const response = await this.apiClient.post<ApiResponse<string>>(
                '/auth/resend-otp',
                request
            );

            this.logger.info('✅ OTP resent successfully');
            
            return {
                success: response.data.success,
                message: response.data.message,
                code: response.data.code,
                data: response.data.data
            };
        } catch (error: any) {
            this.logger.error(`❌ Resend OTP failed: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Failed to resend OTP',
                error.response?.status || 400
            );
        }
    }

    async googleLogin(request: GoogleLoginRequest): Promise<ApiResponse<LoginResponseData>> {
        try {
            this.logger.info('🔄 Google login...');
            
            const response = await this.apiClient.post<ApiResponse<{ accessToken: string; user: any }>>(
                '/auth/google-login',
                request
            );

            this.logger.info('✅ Google login successful');
            
            return {
                success: response.data.success,
                message: response.data.message,
                code: response.data.code,
                data: response.data.data
            };
        } catch (error: any) {
            this.logger.error(`❌ Google login failed: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Google login failed',
                error.response?.status || 401
            );
        }
    }

    async getByEmail(email: string): Promise<RegisterUserRequest | null> {
        try {
            this.logger.info(`🔄 Fetching account by email: ${email}`);
            
            const response = await this.apiClient.get<RegisterUserRequest>(
                `/auth/user`,
                { params: { email } }
            );

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404 || error.code === 404) {
                return null;
            }
            this.logger.error(`❌ Failed to get account: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Failed to fetch user',
                error.response?.status || 500
            );
        }
    }

    async getAll(): Promise<RegisterUserRequest[]> {
        try {
            this.logger.info('🔄 Fetching all accounts...');
            
            const response = await this.apiClient.get<RegisterUserRequest[]>('/auth/users');

            return response.data;
        } catch (error: any) {
            this.logger.error(`❌ Failed to get accounts: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Failed to fetch users',
                error.response?.status || 500
            );
        }
    }

    async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<string>> {
        const response = await this.apiClient.post<ApiResponse<string>>(
            ApiEndpoints.auth.changePassword,
            request
        );
        return response.data;
    }

    async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<string>> {
        try {
            this.logger.info('🔄 Requesting password reset...');
            
            const response = await this.apiClient.post<ApiResponse<string>>(
                ApiEndpoints.auth.forgotPassword,
                request
            );

            this.logger.info('✅ Password reset OTP sent successfully');
            
            return {
                success: response.data.success,
                message: response.data.message,
                code: response.data.code,
                data: response.data.data
            };
        } catch (error: any) {
            this.logger.error(`❌ Forgot password failed: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Failed to send reset password OTP',
                error.response?.status || 400
            );
        }
    }

    async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<string>> {
        try {
            this.logger.info('🔄 Resetting password...');
            
            const response = await this.apiClient.post<ApiResponse<string>>(
                ApiEndpoints.auth.resetPassword,
                request
            );

            this.logger.info('✅ Password reset successful');
            
            return {
                success: response.data.success,
                message: response.data.message,
                code: response.data.code,
                data: response.data.data
            };
        } catch (error: any) {
            this.logger.error(`❌ Reset password failed: ${error.message}`);
            
            if (error instanceof ServerException) {
                throw error;
            }
            
            throw new ServerException(
                error.response?.data?.message || 'Failed to reset password',
                error.response?.status || 400
            );
        }
    }
}