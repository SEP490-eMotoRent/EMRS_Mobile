import { Account } from "../../entities/account/Account";
import { Renter } from "../../entities/account/Renter";
import { AccountRepository } from "../../repositories/account/AccountRepository";

export interface RegisterUseCaseInput {
    email: string;
    username: string;
    password: string;
    fullname?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
}

/**
 * CORRECTED RegisterUseCase
 * 
 * Fixed Renter constructor arguments to match actual constructor signature:
 * 
 * Renter(
 *   id, email, phone, address,
 *   accountId, membershipId,
 *   isVerified, verificationCode,
 *   dateOfBirth, verificationCodeExpiry,
 *   avatarUrl, wallet, account,
 *   createdAt, updatedAt, deletedAt, isDeleted
 * )
 */
export class RegisterUseCase {
    constructor(private accountRepo: AccountRepository) {}
    
    async execute(input: RegisterUseCaseInput): Promise<void> {
        // ✅ CORRECTED: Renter constructor with proper argument order
        const renter = new Renter(
            `renter_${input.username}`,   // 1. id
            input.email,                   // 2. email
            input.phone || '',             // 3. phone
            input.address || '',           // 4. address
            input.username,                // 5. accountId (will match Account.id)
            'default_membership',          // 6. membershipId
            false,                         // 7. isVerified
            '',                            // 8. verificationCode
            input.dateOfBirth,             // 9. dateOfBirth (optional)
            undefined,                     // 10. verificationCodeExpiry (optional)
            input.avatarUrl || '',         // 11. avatarUrl (optional)
            undefined,                     // 12. wallet (optional)
            undefined,                     // 13. account (will be set below)
            new Date(),                    // 14. createdAt
            null,                          // 15. updatedAt
            null,                          // 16. deletedAt
            false                          // 17. isDeleted
        );

        // ✅ Account constructor is correct
        const account = new Account(
            input.username,               // 1. id
            input.username,               // 2. username
            input.password,               // 3. password
            'Renter',                     // 4. role
            input.fullname || '',         // 5. fullname (optional)
            undefined,                    // 6. refreshToken (optional)
            undefined,                    // 7. refreshTokenExpiry (optional)
            false,                        // 8. isRefreshTokenRevoked
            undefined,                    // 9. resetPasswordToken (optional)
            undefined,                    // 10. resetPasswordTokenExpiry (optional)
            renter,                       // 11. renter
            undefined,                    // 12. staff
            new Date(),                   // 13. createdAt
            null,                         // 14. updatedAt
            null,                         // 15. deletedAt
            false                         // 16. isDeleted
        );

        // Link renter back to account
        renter.account = account;
        
        // Save to repository
        await this.accountRepo.create(account);
    }
}