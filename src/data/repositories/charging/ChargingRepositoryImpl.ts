import { ChargingRepository } from "../../../domain/repositories/charging/ChargingRepository";
import { ChargingRemoteDataSource } from "../../datasources/interfaces/remote/charging/ChargingRemoteDataSource";
import { ApiResponse } from "../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../models/charging/BookingChargingResponse";
import { CreateChargingRecordRequest } from "../../models/charging/CreateChargingRecordRequest";
import { GetChargingRateResponse } from "../../models/charging/GetChargingRateResponse";
import { GetChargingRateRequest } from "../../models/charging/GetChargingRateRequest";

export class ChargingRepositoryImpl implements ChargingRepository {
  constructor(private remote: ChargingRemoteDataSource) {}

  async getByLicensePlate(
    licensePlate: string
  ): Promise<ApiResponse<BookingChargingResponse>> {
    return await this.remote.getByLicensePlate(licensePlate);
  }

  async createChargingRecord(
    request: CreateChargingRecordRequest
  ): Promise<ApiResponse<any>> {
    return await this.remote.createChargingRecord(request);
  }

  async getChargingRate(request: GetChargingRateRequest): Promise<ApiResponse<GetChargingRateResponse>> {
    return await this.remote.getChargingRate(request);
  }
}
