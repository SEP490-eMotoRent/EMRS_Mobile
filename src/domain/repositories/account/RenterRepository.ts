import { RenterResponse } from "../../../data/models/account/renter/RenterResponse";
import { Renter } from "../../entities/account/Renter";
import { ScanFaceRequest } from "../../../data/models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../../data/models/account/renter/ScanFaceResponse";
import { ApiResponse } from "../../../core/network/APIResponse";
import { UpdateRenterRequest } from "../../../data/models/account/renter/update/UpdateRenterRequest";
import { UpdateRenterResponse } from "../../../data/models/account/renter/update/RenterAccountUpdateResponse";
import { GetRenterByCitizenIdResponse } from "../../../data/models/account/renter/GetRenterByCitizenIdResponse";

export interface RenterRepository {
    create(renter: Renter): Promise<void>;
    getAll(): Promise<Renter[]>;
    getById(id: string): Promise<RenterResponse>;
    getCurrentRenter(): Promise<Renter>;
    getCurrentRenterRaw(): Promise<RenterResponse>; // ADD THIS
    update(request: UpdateRenterRequest): Promise<UpdateRenterResponse>;
    scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>>;
    getByCitizenId(citizenId: string): Promise<ApiResponse<GetRenterByCitizenIdResponse>>;
}
