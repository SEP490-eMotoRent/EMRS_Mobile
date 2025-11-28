import { ApiResponse } from "../../../../core/network/APIResponse";
import { AccountRepository } from "../../../repositories/account/AccountRepository";
export class VerifyOtpUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(email: string, otpCode: string): Promise<ApiResponse<string>> {
        return await this.repository.verifyOtp(email, otpCode);
    }
}