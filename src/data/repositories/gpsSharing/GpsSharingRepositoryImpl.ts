import { GpsSharingRemoteDataSource } from "../../datasources/interfaces/remote/gpsSharing/GpsSharingRemoteDataSource";
import { InviteRequest } from "../../models/gpsSharing/InviteRequest";
import { ApiResponse } from "../../../core/network/APIResponse";
import { JoinRequest } from "../../models/gpsSharing/JoinRequest";
import { GpsSharingRepository } from "../../../domain/repositories/gpsSharing/GpsSharingRepository";
import { InviteResponse } from "../../models/gpsSharing/InviteResponse";
import { SessionDetailResponse } from "../../models/gpsSharing/SessionDetailResponse";

export class GpsSharingRepositoryImpl implements GpsSharingRepository {
        constructor(private remoteDataSource: GpsSharingRemoteDataSource) {}

    async invite(request: InviteRequest): Promise<ApiResponse<InviteResponse>> {
        return await this.remoteDataSource.invite(request);
    }

    async join(request: JoinRequest): Promise<ApiResponse<any>> {
        return await this.remoteDataSource.join(request);
    }

    async getSession(sessionId: string): Promise<ApiResponse<SessionDetailResponse>> {
        return await this.remoteDataSource.getSession(sessionId);
    }

    async getSessions(): Promise<ApiResponse<any[]>> {
        return await this.remoteDataSource.getSessions();
    }
    
    async getSessionsByRenterId(renterId: string): Promise<ApiResponse<any[]>> {
        return await this.remoteDataSource.getSessionsByRenterId(renterId);
    }
}