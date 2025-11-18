import { ApiResponse } from "../../../core/network/APIResponse";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { AccountRepository } from "../../../domain/repositories/account/AccountRepository";
import { AccountRemoteDataSource } from "../../datasources/interfaces/remote/account/AccountRemoteDataSource";
import { GoogleLoginRequest } from "../../models/account/accountDTO/GoogleLoginRequest";
import { LoginResponseData } from "../../models/account/accountDTO/LoginResponse";
import { RegisterUserRequest } from "../../models/account/accountDTO/RegisterUserRequest";

export class AccountRepositoryImpl implements AccountRepository {
    constructor(private remote: AccountRemoteDataSource) {}

    // ✅ FIXED: Now uses REMOTE data source
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
        await this.remote.create(request);
    }

    async getAll(): Promise<Account[]> {
        const models = await this.remote.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getByEmail(email: string): Promise<Account | null> {
        const model = await this.remote.getByEmail(email);
        return model ? this.mapToEntity(model) : null;
    }

    private mapToEntity(model: RegisterUserRequest): Account {
        // STEP 1: Create MINIMAL Renter (no account yet)
        const renterId = `renter_${model.username}`;
        const minimalRenter = new Renter(
            renterId,
            model.email,
            model.phone,
            model.address,
            model.username,           // accountId
            'default_membership',
            false,
            '',
            model.dateOfBirth,
            undefined,
            model.avatarUrl,
            undefined,
            undefined,                // ← account: Account | undefined
            new Date(),               // ← createdAt
            null,                     // updatedAt
            null,                     // deletedAt
            false                     // isDeleted
        );

        // STEP 2: Create MINIMAL Membership
        const minimalMembership = new Membership(
            'default_membership',
            'Basic',
            0, 0, 0, 'Basic membership',
            [],
            new Date(), null, null, false
        );

        // STEP 3: Create Account
        const account = new Account(
            model.username,           // id
            model.username,           // username
            model.password,           // password
            'Renter',                 // role
            model.fullname,           // fullname
            undefined, undefined, false, undefined, undefined,
            minimalRenter,            // renter
            undefined,                // staff
            new Date(),               // createdAt
            null, null, false
        );

        // STEP 4: LINK CIRCULAR REFERENCES
        minimalRenter.account = account;
        minimalRenter.membership = minimalMembership;

        return account;
    }

    async login(username: string, password: string): Promise<ApiResponse<LoginResponseData>> {
        return await this.remote.login({ username, password });
    }

    async googleLogin(idToken: string): Promise<ApiResponse<LoginResponseData>> {
        const request: GoogleLoginRequest = { idToken };
        return await this.remote.googleLogin(request);
    }
}