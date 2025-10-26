import { ApiResponse } from "../../../core/network/APIResponse";
import { LoginResponseData } from "../../../data/models/account/accountDTO/LoginResponse";
import { AccountRepository } from "../../repositories/account/AccountRepository";

export interface LoginUseCaseInput {
    username: string;
    password: string;
}

export class LoginUseCase {
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(input: LoginUseCaseInput): Promise<ApiResponse<LoginResponseData>> {
        return await this.accountRepo.login(input.username, input.password);
    }
}