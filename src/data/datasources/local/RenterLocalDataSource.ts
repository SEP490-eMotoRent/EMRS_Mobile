import { RenterModel } from '../../models/RenterModel';

export interface RenterLocalDataSource {
    cacheRenter(renter: RenterModel): Promise<void>;
    getCachedRenter(id: string): Promise<RenterModel | null>;
    clearCache(id: string): Promise<void>;
}

// Simple in-memory cache for now. Replace with AsyncStorage later.
export class RenterLocalDataSourceImpl implements RenterLocalDataSource {
    private readonly cache: Map<string, RenterModel>;

    constructor() {
        this.cache = new Map<string, RenterModel>();
    }

    async cacheRenter(renter: RenterModel): Promise<void> {
        this.cache.set(renter.id, renter);
    }

    async getCachedRenter(id: string): Promise<RenterModel | null> {
        return this.cache.get(id) || null;
    }

    async clearCache(id: string): Promise<void> {
        this.cache.delete(id);
    }
}