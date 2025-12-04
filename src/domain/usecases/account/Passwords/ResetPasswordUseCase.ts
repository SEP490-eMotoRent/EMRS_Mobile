import { ApiResponse } from "../../../../core/network/APIResponse";
import { ResetPasswordRequest } from "../../../../data/models/account/password/ResetPasswordRequest";
import { AccountRepository } from "../../../repositories/account/AccountRepository";

export class ResetPasswordUseCase {
    constructor(private accountRepository: AccountRepository) {}

    async execute(
        email: string,
        otpCode: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<ApiResponse<string>> {
        const request: ResetPasswordRequest = {
            email,
            otpCode,
            newPassword,
            confirmPassword
        };
        return await this.accountRepository.resetPassword(request);
    }
}