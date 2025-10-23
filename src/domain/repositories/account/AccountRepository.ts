import { Account } from '../../entities/account/Account';

export interface AccountRepository {
    create(account: Account): Promise<void>;
    getAll(): Promise<Account[]>;
    getByEmail(email: string): Promise<Account | null>;
}