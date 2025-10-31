import { RenterResponse } from "../../../data/models/account/renter/RenterResponse";
import { Renter } from "../../entities/account/Renter";

export interface RenterRepository {
    create(renter: Renter): Promise<void>;
    getAll(): Promise<Renter[]>;
    getCurrentRenter(): Promise<Renter>;
    getCurrentRenterRaw(): Promise<RenterResponse>; // ADD THIS
    update(renter: Renter): Promise<void>;
}