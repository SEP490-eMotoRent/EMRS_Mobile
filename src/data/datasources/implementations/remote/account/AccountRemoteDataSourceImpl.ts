import { ServerException } from "../../../../../core/errors/ServerException";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
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
import { ApiCallWrapper } from "../utils/ApiCallWrapper";
import { ResponseMapper } from "../utils/ResponseMapper";

/**
 * Remote data source implementation for account operations
 * Handles all account-related API communications
 */
export class AccountRemoteDataSourceImpl implements AccountRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly apiWrapper: ApiCallWrapper;

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
        this.apiWrapper = new ApiCallWrapper();
    }

    async login(request: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
        return this.apiWrapper.execute(
            'Logging in user',
            async () => {
                const response = await this.apiClient.post<ApiResponse<LoginResponseData>>(
                    '/auth/login',
                    request
                );
                return ResponseMapper.mapApiResponse(response);
            },
            'Invalid username or password',
            401
        );
    }

    async create(request: RegisterUserRequest): Promise<RegisterUserRequest> {
        return this.apiWrapper.execute(
            'Creating account via API',
            async () => {
                const response = await this.apiClient.post<RegisterUserRequest>(
                    '/auth/register',
                    request
                );
                return ResponseMapper.extractData(response);
            },
            'Failed to register user'
        );
    }

    async verifyOtp(request: VerifyOtpRequest): Promise<ApiResponse<string>> {
        return this.apiWrapper.execute(
            'Verifying OTP',
            async () => {
                const response = await this.apiClient.post<ApiResponse<string>>(
                    '/auth/verify-otp',
                    request
                );
                return ResponseMapper.mapApiResponse(response);
            },
            'OTP verification failed',
            400
        );
    }

    async resendOtp(request: ResendOtpRequest): Promise<ApiResponse<string>> {
        return this.apiWrapper.execute(
            'Resending OTP',
            async () => {
                const response = await this.apiClient.post<ApiResponse<string>>(
                    '/auth/resend-otp',
                    request
                );
                return ResponseMapper.mapApiResponse(response);
            },
            'Failed to resend OTP',
            400
        );
    }

    async googleLogin(request: GoogleLoginRequest): Promise<ApiResponse<LoginResponseData>> {
        return this.apiWrapper.execute(
            'Google login',
            async () => {
                const response = await this.apiClient.post<ApiResponse<LoginResponseData>>(
                    '/auth/google-login',
                    request
                );
                return ResponseMapper.mapApiResponse(response);
            },
            'Google login failed',
            401
        );
    }

    async getByEmail(email: string): Promise<RegisterUserRequest | null> {
        try {
            return await this.apiWrapper.execute(
                `Fetching account by email: ${email}`,
                async () => {
                    const response = await this.apiClient.get<RegisterUserRequest>(
                        `/auth/user`,
                        { params: { email } }
                    );
                    return ResponseMapper.extractData(response);
                },
                'Failed to fetch user'
            );
        } catch (error: any) {
            // Special case: return null for 404 instead of throwing
            if (error.response?.status === 404 || error.code === 404) {
                return null;
            }
            throw error;
        }
    }

    async getAll(): Promise<RegisterUserRequest[]> {
        return this.apiWrapper.execute(
            'Fetching all accounts',
            async () => {
                const response = await this.apiClient.get<RegisterUserRequest[]>('/auth/users');
                return ResponseMapper.extractData(response);
            },
            'Failed to fetch users'
        );
    }

    async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<string>> {
        return this.apiWrapper.execute(
            'Changing password',
            async () => {
                const response = await this.apiClient.post<ApiResponse<string>>(
                    ApiEndpoints.auth.changePassword,
                    request
                );
                return ResponseMapper.extractData(response);
            },
            'Failed to change password',
            400
        );
    }

    async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<string>> {
        return this.apiWrapper.execute(
            'Requesting password reset',
            async () => {
                const response = await this.apiClient.post<ApiResponse<string>>(
                    ApiEndpoints.auth.forgotPassword,
                    request
                );
                return ResponseMapper.mapApiResponse(response);
            },
            'Failed to send reset password OTP',
            400
        );
    }

    async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<string>> {
        return this.apiWrapper.execute(
            'Resetting password',
            async () => {
                const response = await this.apiClient.post<ApiResponse<string>>(
                    ApiEndpoints.auth.resetPassword,
                    request
                );
                return ResponseMapper.mapApiResponse(response);
            },
            'Failed to reset password',
            400
        );
    }
}