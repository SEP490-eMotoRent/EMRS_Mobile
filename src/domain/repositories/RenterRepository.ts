import { Renter } from '../entities/Renter';

export interface RenterRepository {
    getRenter(id: string): Promise<Renter | null>;
    createRenter(renter: Renter): Promise<void>;
    updateRenter(renter: Renter): Promise<void>;
}