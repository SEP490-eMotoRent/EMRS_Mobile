import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";
import { UpdateRenterRequest } from "../../../../models/account/renter/UpdateRenterRequest";

export interface RenterRemoteDataSource {
    create(): Promise<RegisterRenterResponse>;
    getAll(): Promise<RegisterRenterResponse[]>;
    update(request: UpdateRenterRequest): Promise<RegisterRenterResponse>;
    getById(id: string): Promise<RegisterRenterResponse | null>; // ← NEW
}