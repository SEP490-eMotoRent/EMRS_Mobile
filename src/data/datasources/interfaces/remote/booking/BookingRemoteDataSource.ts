import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { BookingResponse } from "../../../../models/booking/BookingResponse";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";

export interface BookingRemoteDataSource {
  create(request: CreateBookingRequest): Promise<BookingResponse>;
  getById(id: string): Promise<BookingResponse | null>;
  getByRenter(renterId: string): Promise<BookingResponse[]>;
  getCurrentRenterBookings(): Promise<BookingResponse[]>;
  getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number
  ): Promise<PaginatedBookingResponse>;
}
