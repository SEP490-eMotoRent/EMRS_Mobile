import { ChargingRepository } from "../../../domain/repositories/charging/ChargingRepository";
import { ChargingRemoteDataSource } from "../../datasources/interfaces/remote/charging/ChargingRemoteDataSource";
import { ApiResponse } from "../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../models/charging/BookingChargingResponse";

export class ChargingRepositoryImpl implements ChargingRepository {
  constructor(private remote: ChargingRemoteDataSource) {}

  async getByLicensePlate(
    licensePlate: string
  ): Promise<ApiResponse<BookingChargingResponse>> {
    return await this.remote.getByLicensePlate(licensePlate);
  }
}
