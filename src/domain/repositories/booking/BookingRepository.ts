import { Booking } from "../../entities/booking/Booking";
import { PaginatedBooking } from "../../entities/booking/PaginatedBooking";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  getById(id: string): Promise<Booking | null>;
  getByRenter(renterId: string): Promise<Booking[]>;
  getCurrentRenterBookings(): Promise<Booking[]>;
  getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number,
  ): Promise<PaginatedBooking>;
}
