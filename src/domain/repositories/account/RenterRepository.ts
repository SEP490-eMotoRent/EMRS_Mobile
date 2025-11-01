import { RenterResponse } from "../../../data/models/account/renter/RenterResponse";
import { Renter } from "../../entities/account/Renter";
import { ScanFaceRequest } from "../../../data/models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../../data/models/account/renter/ScanFaceResponse";
import { ApiResponse } from "../../../core/network/APIResponse";

export interface RenterRepository {
    create(renter: Renter): Promise<void>;
    getAll(): Promise<Renter[]>;
    getCurrentRenter(): Promise<Renter>;
    getCurrentRenterRaw(): Promise<RenterResponse>; // ADD THIS
    update(renter: Renter): Promise<void>;
    scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>>;
}
