import { GpsSharingRepository } from "../../repositories/gpsSharing/GpsSharingRepository";
import { ApiResponse } from "../../../core/network/APIResponse";

export class CancelGpsSharingSessionUseCase {
    private repository: GpsSharingRepository;

    constructor(repository: GpsSharingRepository) {
        this.repository = repository;
    }

    async execute(sessionId: string): Promise<ApiResponse<any>> {
        return this.repository.cancel(sessionId);
    }
}

