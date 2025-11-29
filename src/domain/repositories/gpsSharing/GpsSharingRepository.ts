import { ApiResponse } from "../../../core/network/APIResponse";
import { InviteRequest } from "../../../data/models/gpsSharing/InviteRequest";
import { JoinRequest } from "../../../data/models/gpsSharing/JoinRequest";
import { InviteResponse } from "../../../data/models/gpsSharing/InviteResponse";

export interface GpsSharingRepository {
    invite(request: InviteRequest): Promise<ApiResponse<InviteResponse>>;
    join(request: JoinRequest): Promise<ApiResponse<any>>;
    getSession(sessionId: string): Promise<ApiResponse<any>>;
    getSessions(): Promise<ApiResponse<any[]>>;
}