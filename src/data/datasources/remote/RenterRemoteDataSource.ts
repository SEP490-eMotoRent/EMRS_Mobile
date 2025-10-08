import { RenterModel } from '../../models/RenterModel';

export interface RenterRemoteDataSource {
    getRenter(id: string): Promise<RenterModel | null>;
    createRenter(renter: RenterModel): Promise<void>;
    updateRenter(renter: RenterModel): Promise<void>;
}

// Simple in-memory mock implementation (replace with API calls later)
export class RenterRemoteDataSourceImpl implements RenterRemoteDataSource {
    private readonly store: RenterModel[];

    constructor(initial?: RenterModel[]) {
        this.store = initial || [];
    }

    async getRenter(id: string): Promise<RenterModel | null> {
        // Simulate latency
        await new Promise(resolve => setTimeout(resolve, 150));
        const found = this.store.find(r => r.id === id);
        return found || null;
    }

    async createRenter(renter: RenterModel): Promise<void> {
        // Simulate latency
        await new Promise(resolve => setTimeout(resolve, 150));
        const idx = this.store.findIndex(r => r.id === renter.id);
        if (idx === -1) {
        this.store.push(renter);
        } else {
        this.store[idx] = renter;
        }
    }

    async updateRenter(renter: RenterModel): Promise<void> {
        // Simulate latency
        await new Promise(resolve => setTimeout(resolve, 150));
        const idx = this.store.findIndex(r => r.id === renter.id);
        if (idx !== -1) {
        this.store[idx] = renter;
        } else {
        this.store.push(renter);
        }
    }
}