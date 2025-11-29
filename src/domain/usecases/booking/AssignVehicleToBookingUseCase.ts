import { ApiResponse } from "../../../core/network/APIResponse";
import { AssignVehicleResponse } from "../../../data/models/booking/AssignVehicleResponse";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class AssignVehicleToBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(vehicleId: string, bookingId: string): Promise<ApiResponse<AssignVehicleResponse>> {
    return await this.bookingRepository.assignVehicle(vehicleId, bookingId);
  }
}
