import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import {
  ApiResponse,
} from "../../../../../core/network/APIResponse";
import { ChargingRemoteDataSource } from "../../../interfaces/remote/charging/ChargingRemoteDataSource";
import { BookingChargingResponse } from "../../../../models/charging/BookingChargingResponse";

export class ChargingRemoteDataSourceImpl implements ChargingRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async getByLicensePlate(
    licensePlate: string
  ): Promise<ApiResponse<BookingChargingResponse>> {
    try {
      const response = await this.axiosClient.get<
        ApiResponse<BookingChargingResponse>
      >(ApiEndpoints.charging.getByLicensePlate, { params: { licensePlate } });
      return {
        success: true,
        message: "Charging found successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error getting charging by license plate:", error);
      throw error;
    }
  }
}
