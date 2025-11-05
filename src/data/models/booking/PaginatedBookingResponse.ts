import { BookingResponse } from "./BookingResponseForRenter";
import { BookingForStaffResponse } from "./staffResponse/BookingResponseForStaff";

export interface PaginatedBookingResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: BookingResponse[] | BookingForStaffResponse[]; // Can be either type
}
