import { Booking } from "../../../domain/entities/booking/Booking";
import { BookingResponse } from "./BookingResponse";

export interface PaginatedBookingResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Booking[];
}
