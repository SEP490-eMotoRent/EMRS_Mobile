import { AccountModel } from '../../models/AccountModel';

export interface AccountRemoteDataSource {
  getAccount(id: string): Promise<AccountModel | null>;
  createAccount(account: AccountModel): Promise<void>;
  updateAccount(account: AccountModel): Promise<void>;
}

// Simple in-memory mock implementation (replace with API calls later)
export class AccountRemoteDataSourceImpl implements AccountRemoteDataSource {
  private readonly store: AccountModel[];

  constructor(initial?: AccountModel[]) {
    this.store = initial || [];
  }

  async getAccount(id: string): Promise<AccountModel | null> {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 150));
    const found = this.store.find(a => a.id === id);
    return found || null;
  }

  async createAccount(account: AccountModel): Promise<void> {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = this.store.findIndex(a => a.id === account.id);
    if (idx === -1) {
      this.store.push(account);
    } else {
      this.store[idx] = account;
    }
  }

  async updateAccount(account: AccountModel): Promise<void> {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = this.store.findIndex(a => a.id === account.id);
    if (idx !== -1) {
      this.store[idx] = account;
    } else {
      this.store.push(account);
    }
  }
}