import { ApiResponse } from "../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../../data/models/charging/BookingChargingResponse";

export interface ChargingRepository {
    getByLicensePlate(licensePlate: string): Promise<ApiResponse<BookingChargingResponse>>;
}