import { GpsSharingRepository } from "../../repositories/gpsSharing/GpsSharingRepository";
import { JoinRequest } from "../../../data/models/gpsSharing/JoinRequest";
import { ApiResponse } from "../../../core/network/APIResponse";

export class GpsSharingJoinUseCase {
    private repository: GpsSharingRepository;

    constructor(repository: GpsSharingRepository) {
        this.repository = repository;
    }

    async execute(request: JoinRequest): Promise<ApiResponse<any>> {
        return this.repository.join(request);
    }
}

