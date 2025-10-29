import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class AssignVehicleToBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(vehicleId: string, bookingId: string): Promise<void> {
    return await this.bookingRepository.assignVehicle(vehicleId, bookingId);
  }
}
