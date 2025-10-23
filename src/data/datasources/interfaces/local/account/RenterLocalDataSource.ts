import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";

export interface RenterLocalDataSource {
    create(): Promise<RegisterRenterResponse>;
    getAll(): Promise<RegisterRenterResponse[]>;
    getById(id: string): Promise<RegisterRenterResponse | null>;
    update(id: string, renter: RegisterRenterResponse): Promise<void>;
    delete(id: string): Promise<void>;
}