import { GpsSharingRepository } from "../../repositories/gpsSharing/GpsSharingRepository";
import { ApiResponse } from "../../../core/network/APIResponse";

export class GetSessionByRenterIdUseCase {
    private repository: GpsSharingRepository;

    constructor(repository: GpsSharingRepository) {
        this.repository = repository;
    }

    async execute(renterId: string): Promise<ApiResponse<any[]>> {
        return this.repository.getSessionsByRenterId(renterId);
    }
}

