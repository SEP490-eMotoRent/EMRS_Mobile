import { BookingResponseForRenter } from "../../../../models/booking/BookingResponseForRenter";
import { BookingWithoutWalletResponse } from "../../../../models/booking/BookingWithoutWalletResponse";
import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingDetailResponse } from "../../../../models/booking/BookingDetailResponse"; // ✅ CHANGED
import { VNPayCallback } from "../../../../models/booking/vnpay/VNPayCallback";
import { BookingResponse } from "../../../../models/booking/BookingResponse";
import { AssignVehicleResponse } from "../../../../models/booking/AssignVehicleResponse";
import { ApiResponse } from "../../../../../core/network/APIResponse";

/**
 * Remote data source interface for booking operations
 */
export interface BookingRemoteDataSource {
  /**
   * Create a new booking
   */
  create(request: CreateBookingRequest): Promise<BookingResponseForRenter>;

  /**
   * Create a new booking with VNPay payment
   */
  createVNPay(request: CreateBookingRequest): Promise<BookingWithoutWalletResponse>;

  /**
   * Get booking by ID (returns full booking details with additional fees)
   */
  getById(id: string): Promise<BookingDetailResponse | null>; // ✅ CHANGED

  /**
   * Confirm VNPay payment callback
   */
  confirmVNPayPayment(request: VNPayCallback): Promise<void>;

  /**
   * Get bookings by renter ID
   */
  getByRenter(renterId: string): Promise<BookingResponseForRenter[]>;

  /**
   * Get current renter's bookings
   */
  getCurrentRenterBookings(): Promise<BookingResponseForRenter[]>;

  /**
   * Get paginated bookings with filters
   */
  getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    date: string,
    pageNum: number,
    pageSize: number
  ): Promise<PaginatedBookingResponse>;

  /**
   * Assign vehicle to booking
   */
  assignVehicle(vehicleId: string, bookingId: string): Promise<ApiResponse<AssignVehicleResponse>>;

  /**
   * Cancel a booking
   * @param bookingId - The ID of the booking to cancel
   * @returns The cancelled booking data
   */
  cancelBooking(bookingId: string): Promise<BookingResponse>;
}