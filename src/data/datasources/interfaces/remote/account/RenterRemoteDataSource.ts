import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../../../models/account/renter/RenterResponse";
import { ScanFaceResponse } from "../../../../models/account/renter/ScanFaceResponse";
import { UpdateRenterRequest } from "../../../../models/account/renter/UpdateRenterRequest";
import { ScanFaceRequest } from "../../../../models/account/renter/ScanFaceRequest";
import { ApiResponse } from "../../../../../core/network/APIResponse";

export interface RenterRemoteDataSource {
    create(): Promise<RegisterRenterResponse>;
    getAll(): Promise<RegisterRenterResponse[]>;
    getById(id: string): Promise<RenterResponse>;
    getCurrent(): Promise<RenterResponse>;
    update(request: UpdateRenterRequest): Promise<RegisterRenterResponse>;
    scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>>;
}