import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";

export interface RenterRemoteDataSource {
    create(): Promise<RegisterRenterResponse>;
    getAll(): Promise<RegisterRenterResponse[]>;
}