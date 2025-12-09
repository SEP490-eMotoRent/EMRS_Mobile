import { ApiResponse } from "../../../../core/network/APIResponse";
import { LoginResponseData } from "../../../../data/models/account/accountDTO/LoginResponse";
import { AccountRepository } from "../../../repositories/account/AccountRepository";

export class GoogleLoginUseCase {
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(idToken: string): Promise<ApiResponse<LoginResponseData>> {
        // Validate idToken
        this.validateIdToken(idToken);
        
        // Call repository
        return await this.accountRepo.googleLogin(idToken);
    }
    
    private validateIdToken(idToken: string): void {
        if (!idToken || idToken.trim().length === 0) {
            throw new Error('Google ID Token không được để trống');
        }
        
        const parts = idToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Google ID Token không hợp lệ');
        }
        
        // Check for empty segments (e.g., "a..c" has empty middle segment)
        if (parts.some(part => part.length === 0)) {
            throw new Error('Google ID Token không hợp lệ');
        }
        
        if (idToken.length < 100) {
            throw new Error('Google ID Token không hợp lệ');
        }
    }
}