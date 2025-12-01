import { ApiResponse } from "../../../core/network/APIResponse";
import { ChangePasswordRequest } from "../../../data/models/account/password/ChangePasswordRequest";
import { AccountRepository } from "../../repositories/account/AccountRepository";

export class ChangePasswordUseCase {
    constructor(private accountRepository: AccountRepository) {}

    async execute(request: ChangePasswordRequest): Promise<ApiResponse<string>> {
        return await this.accountRepository.changePassword(request);
    }
}