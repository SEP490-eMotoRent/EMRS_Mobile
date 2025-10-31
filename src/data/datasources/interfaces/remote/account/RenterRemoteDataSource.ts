import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../../../models/account/renter/RenterResponse";
import { UpdateRenterRequest } from "../../../../models/account/renter/UpdateRenterRequest";

export interface RenterRemoteDataSource {
    create(): Promise<RegisterRenterResponse>;
    getAll(): Promise<RegisterRenterResponse[]>;
    getById(id: string): Promise<RenterResponse>;
    getCurrent(): Promise<RenterResponse>;
    update(request: UpdateRenterRequest): Promise<RegisterRenterResponse>;
}