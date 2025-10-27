import { Booking } from "../../../domain/entities/booking/Booking";

export interface PaginatedBooking {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Booking[]; // Domain entities
}