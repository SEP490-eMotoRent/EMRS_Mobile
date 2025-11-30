import { GpsSharingRepository } from "../../repositories/gpsSharing/GpsSharingRepository";
import { ApiResponse } from "../../../core/network/APIResponse";
import { SessionDetailResponse } from "../../../data/models/gpsSharing/SessionDetailResponse";

export class GetGpsSharingSessionDetailUseCase {
    private repository: GpsSharingRepository;

    constructor(repository: GpsSharingRepository) {
        this.repository = repository;
    }

    async execute(sessionId: string): Promise<ApiResponse<SessionDetailResponse>> {
        return this.repository.getSession(sessionId);
    }
}

