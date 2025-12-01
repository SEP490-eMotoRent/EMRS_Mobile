import { ApiResponse } from "../../../../../core/network/APIResponse";
import { JoinRequest } from "../../../../models/gpsSharing/JoinRequest";
import { InviteRequest } from "../../../../models/gpsSharing/InviteRequest";
import { InviteResponse } from "../../../../models/gpsSharing/InviteResponse";
import { SessionDetailResponse } from "../../../../models/gpsSharing/SessionDetailResponse";


export interface GpsSharingRemoteDataSource {
    invite(request: InviteRequest): Promise<ApiResponse<InviteResponse>>;
    join(request: JoinRequest): Promise<ApiResponse<any>>;
    getSession(sessionId: string): Promise<ApiResponse<SessionDetailResponse>>;
    getSessions(): Promise<ApiResponse<any[]>>;
    getSessionsByRenterId(renterId: string): Promise<ApiResponse<any[]>>;
}

