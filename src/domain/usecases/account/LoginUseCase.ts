import { Account } from "../../entities/account/Account";
import { AccountRepository } from "../../repositories/account/AccountRepository";

export class LoginUseCase {
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(email: string): Promise<Account | null> {
        return await this.accountRepo.getByEmail(email);
    }
}