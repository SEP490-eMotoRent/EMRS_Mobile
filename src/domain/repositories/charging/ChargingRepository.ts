import { ApiResponse } from "../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../../data/models/charging/BookingChargingResponse";
import { CreateChargingRecordRequest } from "../../../data/models/charging/CreateChargingRecordRequest";
import { GetChargingRateRequest } from "../../../data/models/charging/GetChargingRateRequest";
import { GetChargingRateResponse } from "../../../data/models/charging/GetChargingRateResponse";

export interface ChargingRepository {
    getByLicensePlate(licensePlate: string): Promise<ApiResponse<BookingChargingResponse>>;
    createChargingRecord(request: CreateChargingRecordRequest): Promise<ApiResponse<any>>;
    getChargingRate(request: GetChargingRateRequest): Promise<ApiResponse<GetChargingRateResponse>>;
}