import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateRentalPricingRequest } from '../../../../models/financial/rentalPricing/CreateRentalPricingRequest';
import { RentalPricingResponse } from '../../../../models/financial/rentalPricing/RentalPricingResponse';
import { RentalPricingLocalDataSource } from '../../../interfaces/local/financial/RentalPricingLocalDataSource';

export class RentalPricingLocalDataSourceImpl implements RentalPricingLocalDataSource {
    private readonly KEY = '@rental_pricings';

    async create(request: CreateRentalPricingRequest): Promise<RentalPricingResponse> {
        const pricings = await this.getAll();
        const newPricing: RentalPricingResponse = { id: `local_${Date.now()}`, ...request };
        pricings.push(newPricing);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(pricings));
        return newPricing;
    }

    async getAll(): Promise<RentalPricingResponse[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    async getById(id: string): Promise<RentalPricingResponse | null> {
        const pricings = await this.getAll();
        return pricings.find(p => p.id === id) || null;
    }

    async update(id: string, pricing: RentalPricingResponse): Promise<void> {
        const pricings = await this.getAll();
        const index = pricings.findIndex(p => p.id === id);
        if (index !== -1) {
        pricings[index] = pricing;
        await AsyncStorage.setItem(this.KEY, JSON.stringify(pricings));
        }
    }

    async delete(id: string): Promise<void> {
        const pricings = await this.getAll();
        const filtered = pricings.filter(p => p.id !== id);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(filtered));
    }
}