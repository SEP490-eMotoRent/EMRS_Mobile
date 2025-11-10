import { ApiResponse } from "../../../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../../../models/charging/BookingChargingResponse";


export interface ChargingRemoteDataSource {
    getByLicensePlate(licensePlate: string): Promise<ApiResponse<BookingChargingResponse>>;
}