import { GpsSharingRepository } from "../../repositories/gpsSharing/GpsSharingRepository";
import { ApiResponse } from "../../../core/network/APIResponse";

export class GetGpsSharingSessionsUseCase {
    private repository: GpsSharingRepository;

    constructor(repository: GpsSharingRepository) {
        this.repository = repository;
    }

    async execute(): Promise<ApiResponse<any[]>> {
        return this.repository.getSessions();
    }
}

