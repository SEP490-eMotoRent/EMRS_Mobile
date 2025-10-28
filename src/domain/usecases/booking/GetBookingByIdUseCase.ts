import { BookingForStaffResponse } from "../../../data/models/booking/staffResponse/BookingResponseForStaff";
import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetBookingByIdUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(
    id: string
  ): Promise<Booking> {
    return await this.bookingRepository.getByIdForStaff(id);
  }
}
