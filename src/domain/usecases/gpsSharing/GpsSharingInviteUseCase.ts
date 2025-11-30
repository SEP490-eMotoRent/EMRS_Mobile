import { GpsSharingRepository } from "../../repositories/gpsSharing/GpsSharingRepository";
import { InviteRequest } from "../../../data/models/gpsSharing/InviteRequest";
import { ApiResponse } from "../../../core/network/APIResponse";
import { InviteResponse } from "../../../data/models/gpsSharing/InviteResponse";

export class GpsSharingInviteUseCase {
    private repository: GpsSharingRepository;

    constructor(repository: GpsSharingRepository) {
        this.repository = repository;
    }

    async execute(request: InviteRequest): Promise<ApiResponse<InviteResponse>> {
        return this.repository.invite(request);
    }
}