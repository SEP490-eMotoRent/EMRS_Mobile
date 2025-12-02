import { ApiResponse } from "../../../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../../../models/charging/BookingChargingResponse";
import { ChargingListResponse } from "../../../../models/charging/ChargingListResponse";
import { CreateChargingRecordRequest } from "../../../../models/charging/CreateChargingRecordRequest";
import { GetChargingRateRequest } from "../../../../models/charging/GetChargingRateRequest";
import { GetChargingRateResponse } from "../../../../models/charging/GetChargingRateResponse";


export interface ChargingRemoteDataSource {
    getByLicensePlate(licensePlate: string): Promise<ApiResponse<BookingChargingResponse>>; 
    createChargingRecord(request: CreateChargingRecordRequest): Promise<ApiResponse<any>>;
    getChargingRate(request: GetChargingRateRequest): Promise<ApiResponse<GetChargingRateResponse>>;
    getByBookingId(bookingId: string): Promise<ApiResponse<ChargingListResponse[]>>;
}