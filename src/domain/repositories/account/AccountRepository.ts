import { ApiResponse } from '../../../core/network/APIResponse';
import { Account } from '../../entities/account/Account';

export interface AccountRepository {
    create(account: Account): Promise<void>;
    getAll(): Promise<Account[]>;
    getByEmail(email: string): Promise<Account | null>;
    login(username: string, password: string): Promise<ApiResponse<string>>;  // ✅ Use ApiResponse
}