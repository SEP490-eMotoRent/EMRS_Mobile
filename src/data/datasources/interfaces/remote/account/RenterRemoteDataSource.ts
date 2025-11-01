import { ApiResponse } from "../../../../../core/network/APIResponse";
import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../../../models/account/renter/RenterResponse";
import { ScanFaceRequest } from "../../../../models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../../../models/account/renter/ScanFaceResponse";
import { UpdateRenterResponse } from "../../../../models/account/renter/update/RenterAccountUpdateResponse";
import { UpdateRenterRequest } from "../../../../models/account/renter/update/UpdateRenterRequest";

export interface RenterRemoteDataSource {
    create(): Promise<RegisterRenterResponse>;
    getAll(): Promise<RegisterRenterResponse[]>;
    getById(id: string): Promise<RenterResponse>;
    getCurrent(): Promise<RenterResponse>;
    update(request: UpdateRenterRequest): Promise<UpdateRenterResponse>;
    scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>>;
}