import { RenterRepository } from "../../repositories/account/RenterRepository";
import { ApiResponse } from "../../../core/network/APIResponse";
import { GetRenterByCitizenIdResponse } from "../../../data/models/account/renter/GetRenterByCitizenIdResponse";

export class GetByCitizenIdUseCase {
    constructor(private renterRepo: RenterRepository) {}
    
    async execute(citizenId: string): Promise<ApiResponse<GetRenterByCitizenIdResponse>> {
        const response = await this.renterRepo.getByCitizenId(citizenId);
        return response;
    }
}