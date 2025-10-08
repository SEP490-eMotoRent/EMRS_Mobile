import { AccountModel } from '../models/AccountModel';
import { Account } from '../../domain/entities/Account';
import { AccountRepository } from '../../domain/repositories/AccountRepository';
import { AccountRemoteDataSource } from '../datasources/remote/AccountRemoteDataSource';
import { AccountLocalDataSource } from '../datasources/local/AccountLocalDataSource';

export class AccountRepositoryImpl implements AccountRepository {
    private readonly remote: AccountRemoteDataSource;
    private readonly local: AccountLocalDataSource;

    constructor({
        remote,
        local,
    }: {
        remote: AccountRemoteDataSource;
        local: AccountLocalDataSource;
    }) {
        this.remote = remote;
        this.local = local;
    }

    async getAccount(id: string): Promise<Account | null> {
        // Try local first
        const cached = await this.local.getCachedAccount(id);
        if (cached) return cached.toEntity();

        // Fall back to remote
        const remoteModel = await this.remote.getAccount(id);
        if (remoteModel) {
        await this.local.cacheAccount(remoteModel);
        return remoteModel.toEntity();
        }

        return null;
    }

    async createAccount(account: Account): Promise<void> {
        const model = AccountModel.fromEntity(account);
        await this.remote.createAccount(model);
        await this.local.cacheAccount(model);
    }

    async updateAccount(account: Account): Promise<void> {
        const model = AccountModel.fromEntity(account);
        await this.remote.updateAccount(model);
        await this.local.cacheAccount(model);
    }
}