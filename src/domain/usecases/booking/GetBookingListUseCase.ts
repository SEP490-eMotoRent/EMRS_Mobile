import { PaginatedBooking } from "../../../data/models/booking/PaginatedBooking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetBookingListUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number
  ): Promise<PaginatedBooking> {
    return await this.bookingRepository.getBookings(
        vehicleModelId,
        renterId,
        bookingStatus,
        pageNum,
        pageSize
      );
  }
}
