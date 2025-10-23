import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { AccountRepository } from "../../../domain/repositories/account/AccountRepository";
import { AccountLocalDataSource } from "../../datasources/interfaces/local/account/AccountLocalDataSource";
import { RegisterUserRequest } from "../../models/account/accountDTO/RegisterUserRequest";
import AsyncStorage from '@react-native-async-storage/async-storage';

    export class AccountRepositoryImpl implements AccountRepository {
    constructor(private local: AccountLocalDataSource) {}

    // ✅ FIXED: EXACT 3 METHODS
    async create(account: Account): Promise<void> {
        const request: RegisterUserRequest = {
        phone: account.renter?.phone || '',
        address: account.renter?.address || '',
        dateOfBirth: account.renter?.dateOfBirth || '',
        avatarUrl: account.renter?.avatarUrl || '',
        email: account.renter?.email || '',
        username: account.username,
        fullname: account.fullname || '',
        password: account.password
        };
        await this.local.create(request);
    }

    async getAll(): Promise<Account[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getByEmail(email: string): Promise<Account | null> {
        const model = await this.local.getByEmail(email);
        return model ? this.mapToEntity(model) : null;
    }

    private mapToEntity(model: RegisterUserRequest): Account {
        // STEP 1: Create MINIMAL Renter
        const renterId = `renter_${model.username}`;
        const minimalRenter = new Renter(
        renterId,
        model.email,
        model.phone,
        model.address,
        model.avatarUrl,
        model.username,           // accountId
        'default_membership',     // membershipId
        null as any,              // account (link later)
        null as any,              // membership (link later)
        false,                    // isVerified
        '',                       // verificationCode
        model.dateOfBirth,
        undefined,                // verificationCodeExpiry
        undefined,                // wallet
        new Date(),
        null,
        null,
        false
        );

        // STEP 2: Create MINIMAL Membership
        const minimalMembership = new Membership(
        'default_membership',
        'Basic',
        0,
        0,
        0,
        'Basic membership',
        [],
        new Date(),
        null,
        null,
        false
        );

        // STEP 3: Create Account (EXACT 16 PARAMS)
        const account = new Account(
        model.username,           // id
        model.username,           // username
        model.password,           // password
        'Renter',                 // role
        model.fullname,           // fullname
        undefined,                // refreshToken
        undefined,                // refreshTokenExpiry
        false,                    // isRefreshTokenRevoked
        undefined,                // resetPasswordToken
        undefined,                // resetPasswordTokenExpiry
        minimalRenter,            // renter
        undefined,                // staff
        new Date(),               // createdAt
        null,                     // updatedAt
        null,                     // deletedAt
        false                     // isDeleted
        );

        // STEP 4: LINK CIRCULAR REFERENCES
        minimalRenter.account = account;
        minimalRenter.membership = minimalMembership;

        return account;
    }
}