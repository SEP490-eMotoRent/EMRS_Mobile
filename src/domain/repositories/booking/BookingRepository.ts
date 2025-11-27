import { Booking } from "../../entities/booking/Booking";
import { PaginatedBooking } from "../../../data/models/booking/PaginatedBooking";
import { VNPayCallback } from "../../../data/models/booking/vnpay/VNPayCallback";

/**
 * Result type for VNPay booking creation
 */
export interface VNPayBookingResult {
  booking: Booking;
  vnpayUrl: string;
}

/**
 * Repository interface for booking operations
 * Defines the contract between domain and data layers
 */
export interface BookingRepository {
  /**
   * Create a new booking
   */
  create(booking: Booking): Promise<Booking>;

  /**
   * Create a new booking with VNPay payment
   */
  createVNPay(booking: Booking): Promise<VNPayBookingResult>;

  /**
   * Get booking by ID
   */
  getById(id: string): Promise<Booking | null>;

  /**
   * Get booking by ID for staff (more detailed)
   */
  getByIdForStaff(id: string): Promise<Booking | null>;

  /**
   * Confirm VNPay payment callback
   */
  confirmVNPayPayment(request: VNPayCallback): Promise<void>;

  /**
   * Get bookings by renter ID
   */
  getByRenter(renterId: string): Promise<Booking[]>;

  /**
   * Get current renter's bookings
   */
  getCurrentRenterBookings(): Promise<Booking[]>;

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
  ): Promise<PaginatedBooking>;

  /**
   * Assign vehicle to booking
   */
  assignVehicle(vehicleId: string, bookingId: string): Promise<void>;

  /**
   * Cancel a booking
   * @param bookingId - The ID of the booking to cancel
   * @returns The cancelled booking entity
   */
  cancelBooking(bookingId: string): Promise<Booking>;
}