import { Renter } from "../../entities/account/Renter";

export interface RenterRepository {
    create(renter: Renter): Promise<void>;
    getAll(): Promise<Renter[]>;
    update(renter: Renter): Promise<void>;
}