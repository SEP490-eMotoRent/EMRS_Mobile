import { ApiResponse } from "../../../../../core/network/APIResponse";
import { JoinRequest } from "../../../../models/gpsSharing/JoinRequest";
import { InviteRequest } from "../../../../models/gpsSharing/InviteRequest";
import { InviteResponse } from "../../../../models/gpsSharing/InviteResponse";


export interface GpsSharingRemoteDataSource {
    invite(request: InviteRequest): Promise<ApiResponse<InviteResponse>>;
    join(request: JoinRequest): Promise<ApiResponse<any>>;
    getSession(sessionId: string): Promise<ApiResponse<any>>;
    getSessions(): Promise<ApiResponse<any[]>>;
}

