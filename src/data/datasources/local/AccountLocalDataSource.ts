import { AccountModel } from '../../models/AccountModel';

export interface AccountLocalDataSource {
    cacheAccount(account: AccountModel): Promise<void>;
    getCachedAccount(id: string): Promise<AccountModel | null>;
    clearCache(id: string): Promise<void>;
}

// Simple in-memory cache for now. Replace with AsyncStorage later.
export class AccountLocalDataSourceImpl implements AccountLocalDataSource {
    private readonly cache: Map<string, AccountModel>;

    constructor() {
        this.cache = new Map<string, AccountModel>();
    }

    async cacheAccount(account: AccountModel): Promise<void> {
        this.cache.set(account.id, account);
    }

    async getCachedAccount(id: string): Promise<AccountModel | null> {
        return this.cache.get(id) || null;
    }

    async clearCache(id: string): Promise<void> {
        this.cache.delete(id);
    }
}