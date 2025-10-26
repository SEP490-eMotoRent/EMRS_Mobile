import { Booking } from "./Booking";

export interface PaginatedBooking {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Booking[];
}
