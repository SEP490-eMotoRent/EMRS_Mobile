import { ApiResponse } from "../../../core/network/APIResponse";
import { LoginResponseData } from "../../../data/models/account/accountDTO/LoginResponse";
import { AccountRepository } from "../../repositories/account/AccountRepository";

export interface LoginUseCaseInput {
    username: string;
    password: string;
}

export class LoginUseCase {
    private readonly MIN_PASSWORD_LENGTH = 6;
    
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(input: LoginUseCaseInput): Promise<ApiResponse<LoginResponseData>> {
        // Validate username
        this.validateUsername(input.username);
        
        // Validate password
        this.validatePassword(input.password);
        
        // Call repository
        return await this.accountRepo.login(input.username, input.password);
    }
    
    private validateUsername(username: string): void {
        if (!username || username.trim().length === 0) {
            throw new Error('Tên đăng nhập không được để trống');
        }
        
        // Trim whitespace
        const trimmed = username.trim();
        
        // Check minimum length
        if (trimmed.length < 3) {
            throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự');
        }
        
        // Check maximum length
        if (trimmed.length > 50) {
            throw new Error('Tên đăng nhập không được vượt quá 50 ký tự');
        }
    }
    
    private validatePassword(password: string): void {
        if (!password || password.length === 0) {
            throw new Error('Mật khẩu không được để trống');
        }
        
        if (password.length < this.MIN_PASSWORD_LENGTH) {
            throw new Error(`Mật khẩu phải có ít nhất ${this.MIN_PASSWORD_LENGTH} ký tự`);
        }
        
        if (password.length > 128) {
            throw new Error('Mật khẩu không được vượt quá 128 ký tự');
        }
    }
}