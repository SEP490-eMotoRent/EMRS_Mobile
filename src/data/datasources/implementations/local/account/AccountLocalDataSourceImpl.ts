import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";
import { AccountLocalDataSource } from "../../../interfaces/local/account/AccountLocalDataSource";
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AccountLocalDataSourceImpl implements AccountLocalDataSource {
    private readonly KEY = '@accounts';

    async getByEmail(email: string): Promise<RegisterUserRequest | null> {
        const accounts = await this.getAll();
        return accounts.find(acc => acc.email === email) || null;
    }

    async create(request: RegisterUserRequest): Promise<RegisterUserRequest> {
        const accounts = await this.getAll();
        const newAccount = { ...request, id: `local_${Date.now()}` };
        accounts.push(newAccount);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(accounts));
        return newAccount;
    }

    async getAll(): Promise<RegisterUserRequest[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    async update(id: string, account: RegisterUserRequest): Promise<void> {
        const accounts = await this.getAll();
        const index = accounts.findIndex(acc => acc.username === id);
        if (index !== -1) {
        accounts[index] = account;
        await AsyncStorage.setItem(this.KEY, JSON.stringify(accounts));
        }
    }

    async delete(id: string): Promise<void> {
        const accounts = await this.getAll();
        const filtered = accounts.filter(acc => acc.username !== id);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(filtered));
    }
}