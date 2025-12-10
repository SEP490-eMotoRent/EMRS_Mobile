import { PaginatedBooking } from "../../../data/models/booking/PaginatedBooking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetBookingListUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    date: string,
    pageNum: number,
    pageSize: number,
    branchId?: string
  ): Promise<PaginatedBooking> {
    return await this.bookingRepository.getBookings(
        vehicleModelId,
        renterId,
        bookingStatus,
        date,
        pageNum,
        pageSize,
        branchId
      );
  }
}
