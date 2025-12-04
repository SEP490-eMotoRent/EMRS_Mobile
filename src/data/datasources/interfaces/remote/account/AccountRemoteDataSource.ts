import { ApiResponse } from "../../../../../core/network/APIResponse";
import { GoogleLoginRequest } from "../../../../models/account/accountDTO/GoogleLoginRequest";
import { LoginRequest } from "../../../../models/account/accountDTO/LoginRequest";
import { LoginResponseData } from "../../../../models/account/accountDTO/LoginResponse";
import { ResendOtpRequest } from "../../../../models/account/accountDTO/otp/ResendOtpRequest";
import { VerifyOtpRequest } from "../../../../models/account/accountDTO/otp/VerifyOtpRequest";
import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";
import { ChangePasswordRequest } from "../../../../models/account/password/ChangePasswordRequest";
import { ForgotPasswordRequest } from "../../../../models/account/password/ForgotPasswordRequest";
import { ResetPasswordRequest } from "../../../../models/account/password/ResetPasswordRequest";

export interface AccountRemoteDataSource {
    getByEmail(email: string): Promise<RegisterUserRequest | null>;
    create(request: RegisterUserRequest): Promise<RegisterUserRequest>;
    getAll(): Promise<RegisterUserRequest[]>;
    login(request: LoginRequest): Promise<ApiResponse<LoginResponseData>>;
    googleLogin(request: GoogleLoginRequest): Promise<ApiResponse<LoginResponseData>>;

    verifyOtp(request: VerifyOtpRequest): Promise<ApiResponse<string>>;
    resendOtp(request: ResendOtpRequest): Promise<ApiResponse<string>>;
    changePassword(request: ChangePasswordRequest): Promise<ApiResponse<string>>;
    forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<string>>;
    resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<string>>;
}