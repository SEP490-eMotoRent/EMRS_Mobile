import { Booking } from "../../entities/booking/Booking";
import { PaginatedBooking } from "../../../data/models/booking/PaginatedBooking";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  getById(id: string): Promise<Booking | null>;
  getByIdForStaff(id: string): Promise<Booking | null>;
  getByRenter(renterId: string): Promise<Booking[]>;
  getCurrentRenterBookings(): Promise<Booking[]>;
  getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number,
  ): Promise<PaginatedBooking>;
  assignVehicle(vehicleId: string, bookingId: string): Promise<void>;
}