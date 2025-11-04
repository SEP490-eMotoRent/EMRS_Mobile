import { BookingResponse } from "../../../../models/booking/BookingResponseForRenter";
import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingForStaffResponse } from "../../../../models/booking/staffResponse/BookingResponseForStaff";

/**
 * Remote data source interface for booking operations
 * Defines the contract for API calls
 */
export interface BookingRemoteDataSource {
  /**
   * Create a new booking
   */
  create(request: CreateBookingRequest): Promise<BookingResponse>;

  /**
   * Get booking by ID (returns staff response with full details)
   */
  getById(id: string): Promise<BookingForStaffResponse | null>;

  /**
   * Get bookings by renter ID
   * ✅ UPDATED: Returns BookingResponse[] (BookingListForRenterResponse[])
   */
  getByRenter(renterId: string): Promise<BookingResponse[]>;

  /**
   * Get current authenticated renter's bookings
   * ✅ UPDATED: Returns BookingResponse[] (BookingListForRenterResponse[])
   */
  getCurrentRenterBookings(): Promise<BookingResponse[]>;

  /**
   * Get paginated list of bookings with filters
   */
  getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number
  ): Promise<PaginatedBookingResponse>;

  /**
   * Assign a vehicle to a booking
   */
  assignVehicle(vehicleId: string, bookingId: string): Promise<void>;
}