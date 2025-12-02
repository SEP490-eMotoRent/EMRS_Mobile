import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { GpsSharingRemoteDataSource } from "../../../../datasources/interfaces/remote/gpsSharing/GpsSharingRemoteDataSource";
import { InviteRequest } from "../../../../models/gpsSharing/InviteRequest";
import { JoinRequest } from "../../../../models/gpsSharing/JoinRequest";
import { InviteResponse } from "../../../../models/gpsSharing/InviteResponse";

export class GpsSharingRemoteDataSourceImpl
  implements GpsSharingRemoteDataSource
{
  constructor(private axiosClient: AxiosClient) {}

  async invite(request: InviteRequest): Promise<ApiResponse<InviteResponse>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<InviteResponse>>(
        ApiEndpoints.gpsSharing.invite,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      throw error;
    }
  }

  async join(request: JoinRequest): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.gpsSharing.join,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error joining session:", error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.get<ApiResponse<any>>(
        ApiEndpoints.gpsSharing.getSession(sessionId)
      );
      return response.data;
    } catch (error: any) {
      console.error("Error getting session:", error);
      throw error;
    }
  }

  async getSessions(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.axiosClient.get<ApiResponse<any[]>>(
        ApiEndpoints.gpsSharing.getSessions
      );
      return response.data;
    } catch (error: any) {
      return {
        success: true,
        message: "Sessions retrieved successfully",
        data: null,
        code: 500,
      };
    }
  }

  async getSessionsByRenterId(renterId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.axiosClient.get<ApiResponse<any[]>>(
        ApiEndpoints.gpsSharing.getSessionsByRenterId(renterId)
      );
      return response.data;
    } catch (error: any) {
      return {
        success: true,
        message: "Sessions retrieved successfully",
        data: null,
        code: 500,
      };
    }
  }
}
