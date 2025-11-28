import { ApiResponse } from "../../../../core/network/APIResponse";
import { AccountRepository } from "../../../repositories/account/AccountRepository";

export class ResendOtpUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(email: string): Promise<ApiResponse<string>> {
        return await this.repository.resendOtp(email);
    }
}