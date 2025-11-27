import { BookingResponseForRenter } from "../../../../models/booking/BookingResponseForRenter";
import { BookingWithoutWalletResponse } from "../../../../models/booking/BookingWithoutWalletResponse";
import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingForStaffResponse } from "../../../../models/booking/staffResponse/BookingResponseForStaff";
import { VNPayCallback } from "../../../../models/booking/vnpay/VNPayCallback";
import { BookingResponse } from "../../../../models/booking/BookingResponse";

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
   * Get booking by ID
   */
  getById(id: string): Promise<BookingForStaffResponse | null>;

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
  assignVehicle(vehicleId: string, bookingId: string): Promise<void>;

  /**
   * Cancel a booking
   * @param bookingId - The ID of the booking to cancel
   * @returns The cancelled booking data
   */
  cancelBooking(bookingId: string): Promise<BookingResponse>;
}