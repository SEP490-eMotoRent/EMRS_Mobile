import { ApiResponse } from '../../../core/network/APIResponse';
import { LoginResponseData } from '../../../data/models/account/accountDTO/LoginResponse';
import { ChangePasswordRequest } from '../../../data/models/account/password/ChangePasswordRequest';
import { ForgotPasswordRequest } from '../../../data/models/account/password/ForgotPasswordRequest';
import { ResetPasswordRequest } from '../../../data/models/account/password/ResetPasswordRequest';
import { Account } from '../../entities/account/Account';

export interface AccountRepository {
    create(account: Account): Promise<void>;
    getAll(): Promise<Account[]>;
    getByEmail(email: string): Promise<Account | null>;
    login(username: string, password: string): Promise<ApiResponse<LoginResponseData>>;
    googleLogin(idToken: string): Promise<ApiResponse<LoginResponseData>>;

    verifyOtp(email: string, otpCode: string): Promise<ApiResponse<string>>;
    resendOtp(email: string): Promise<ApiResponse<string>>;

    changePassword(request: ChangePasswordRequest): Promise<ApiResponse<string>>;
    forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<string>>;
    resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<string>>;
}