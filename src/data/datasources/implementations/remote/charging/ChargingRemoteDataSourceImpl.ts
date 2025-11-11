import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { ChargingRemoteDataSource } from "../../../interfaces/remote/charging/ChargingRemoteDataSource";
import { BookingChargingResponse } from "../../../../models/charging/BookingChargingResponse";
import { CreateChargingRecordRequest } from "../../../../models/charging/CreateChargingRecordRequest";
import { GetChargingRateRequest } from "../../../../models/charging/GetChargingRateRequest";
import { GetChargingRateResponse } from "../../../../models/charging/GetChargingRateResponse";

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

  async getChargingRate(request: GetChargingRateRequest): Promise<ApiResponse<GetChargingRateResponse>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<GetChargingRateResponse>>(
        ApiEndpoints.charging.getChargingRate,
        request
      );
      return {
        success: true,
        message: "Charging rate fetched successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error getting charging rate:", error);
      throw error;
    }
  }

  async createChargingRecord(
    request: CreateChargingRecordRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.charging.create,
        request
      );
      return {
        success: true,
        message: "Charging record created successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error creating charging record:", error);
      throw error;
    }
  }
}
