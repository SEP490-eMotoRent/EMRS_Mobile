import { Account } from "../../entities/account/Account";
import { Renter } from "../../entities/account/Renter";
import { AccountRepository } from "../../repositories/account/AccountRepository";

export interface RegisterUseCaseInput {
    email: string;
    username: string;
    password: string;
    fullname?: string;  // ✅ Now optional
    phone?: string;     // ✅ Now optional
    address?: string;   // ✅ Now optional
    dateOfBirth?: string; // ✅ Now optional
    avatarUrl?: string; // ✅ Already optional
}

export class RegisterUseCase {
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(input: RegisterUseCaseInput): Promise<void> {
        const renter = new Renter(
            `renter_${input.username}`,
            input.email,
            input.phone || '',        // ✅ Default to empty string
            input.address || '',      // ✅ Default to empty string
            input.avatarUrl || '',
            input.username,
            'default_membership',
            null as any,
            null as any,
            false,
            '',
            input.dateOfBirth || '',  // ✅ Default to empty string
            undefined,
            undefined,
            new Date(),
            null,
            null,
            false
        );

        const account = new Account(
            input.username,
            input.username,
            input.password,
            'Renter',
            input.fullname || '',     // ✅ Default to empty string
            undefined,
            undefined,
            false,
            undefined,
            undefined,
            renter,
            undefined,
            new Date(),
            null,
            null,
            false
        );

        renter.account = account;
        await this.accountRepo.create(account);
    }
}