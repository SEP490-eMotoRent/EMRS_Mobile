import { Account } from '../entities/account/Account';

export interface AccountRepository {
    getAccount(id: string): Promise<Account | null>;
    createAccount(account: Account): Promise<void>;
    updateAccount(account: Account): Promise<void>;
}