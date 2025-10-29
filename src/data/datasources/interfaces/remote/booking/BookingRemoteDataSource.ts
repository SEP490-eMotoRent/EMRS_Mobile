import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { 
  BookingResponse, 
} from "../../../../models/booking/BookingResponse";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingForStaffResponse } from "../../../../models/booking/staffResponse/BookingResponseForStaff";

export interface BookingRemoteDataSource {
  /**
   * Create a new booking
   * @returns BookingResponse (simple response with IDs only)
   */
  create(request: CreateBookingRequest): Promise<BookingResponse>;

  /**
   * Get booking by ID
   * @returns BookingForStaffResponse (detailed response with nested objects)
   */
  getById(id: string): Promise<BookingForStaffResponse | null>;

  /**
   * Get bookings by renter ID
   * @returns BookingForStaffResponse[] (detailed responses)
   */
  getByRenter(renterId: string): Promise<BookingForStaffResponse[]>;

  /**
   * Get current renter's bookings
   * @returns BookingForStaffResponse[] (detailed responses)
   */
  getCurrentRenterBookings(): Promise<BookingForStaffResponse[]>;

  /**
   * Get paginated bookings with filters
   * @returns PaginatedBookingResponse (can contain simple or detailed responses)
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
   * @returns void
   */
  assignVehicle(vehicleId: string, bookingId: string): Promise<void>;
}