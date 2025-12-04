import { ApiResponse } from "../../../../core/network/APIResponse";
import { ForgotPasswordRequest } from "../../../../data/models/account/password/ForgotPasswordRequest";
import { AccountRepository } from "../../../repositories/account/AccountRepository";

export class ForgotPasswordUseCase {
    constructor(private accountRepository: AccountRepository) {}

    async execute(email: string): Promise<ApiResponse<string>> {
        const request: ForgotPasswordRequest = { email };
        return await this.accountRepository.forgotPassword(request);
    }
}