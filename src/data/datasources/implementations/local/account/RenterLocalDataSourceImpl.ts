import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRenterResponse } from '../../../../models/account/renter/RegisterRenterResponse';
import { RenterLocalDataSource } from '../../../interfaces/local/account/RenterLocalDataSource';

export class RenterLocalDataSourceImpl implements RenterLocalDataSource {
    private readonly KEY = '@renters';

    async create(): Promise<RegisterRenterResponse> {
        const renters = await this.getAll();
        const newRenter: RegisterRenterResponse = {
        id: `local_${Date.now()}`,
        email: `renter_${Date.now()}@test.com`,
        phone: '+1234567890',
        address: '123 Test St',
        dateOfBirth: '1990-01-01',
        avatarUrl: 'https://example.com/avatar.jpg',
        accountId: `local_${Date.now()}`,
        membershipId: `local_${Date.now()}`,
        verificationCodeExpiry: new Date().toISOString()
        };
        renters.push(newRenter);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(renters));
        return newRenter;
    }

    async getAll(): Promise<RegisterRenterResponse[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    async getById(id: string): Promise<RegisterRenterResponse | null> {
        const renters = await this.getAll();
        return renters.find(r => r.id === id) || null;
    }

    async update(id: string, renter: RegisterRenterResponse): Promise<void> {
        const renters = await this.getAll();
        const index = renters.findIndex(r => r.id === id);
        if (index !== -1) {
        renters[index] = renter;
        await AsyncStorage.setItem(this.KEY, JSON.stringify(renters));
        }
    }

    async delete(id: string): Promise<void> {
        const renters = await this.getAll();
        const filtered = renters.filter(r => r.id !== id);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(filtered));
    }
}