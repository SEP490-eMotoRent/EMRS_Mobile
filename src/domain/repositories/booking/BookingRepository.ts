import { PaginatedBooking } from "../../../data/models/booking/PaginatedBooking";
import { Booking } from "../../entities/booking/Booking";

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
