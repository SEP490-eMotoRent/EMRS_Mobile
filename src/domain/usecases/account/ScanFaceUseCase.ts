import { ScanFaceRequest } from "../../../data/models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../../data/models/account/renter/ScanFaceResponse";
import { RenterRepository } from "../../repositories/account/RenterRepository";
import { ApiResponse } from "../../../core/network/APIResponse";

export class ScanFaceUseCase {
    constructor(private renterRepo: RenterRepository) {}
    
    async execute(input: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>> {
        const response = await this.renterRepo.scanFace(input);
        return response;
    }
}