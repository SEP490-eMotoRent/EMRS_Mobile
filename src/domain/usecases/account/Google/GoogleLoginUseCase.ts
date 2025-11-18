import { ApiResponse } from "../../../../core/network/APIResponse";
import { LoginResponseData } from "../../../../data/models/account/accountDTO/LoginResponse";
import { AccountRepository } from "../../../repositories/account/AccountRepository";

export class GoogleLoginUseCase {
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(idToken: string): Promise<ApiResponse<LoginResponseData>> {
        console.log('==================== GOOGLE LOGIN TO BACKEND ====================');
        console.log('Sending idToken to backend:', idToken.substring(0, 50) + '...');
        console.log('===============================================================');
        
        const response = await this.accountRepo.googleLogin(idToken);
        
        console.log('Backend response:', JSON.stringify(response, null, 2));
        
        return response;
    }
}