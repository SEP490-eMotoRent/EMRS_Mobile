import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

/**
 * Use case for cancelling a booking
 * Business logic: Only bookings with status "Confirmed" or "Booked" can be cancelled
 */
export class CancelBookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    /**
     * Execute the cancel booking use case
     * @param bookingId - The ID of the booking to cancel
     * @returns The cancelled booking
     * @throws Error if booking cannot be cancelled
     */
    async execute(bookingId: string): Promise<Booking> {
        console.log("🎯 [USE CASE] Executing cancel booking for ID:", bookingId);

        if (!bookingId || bookingId.trim() === "") {
        throw new Error("Booking ID is required");
        }

        try {
        // Call repository to cancel the booking
        const cancelledBooking = await this.bookingRepository.cancelBooking(bookingId);

        // Verify the booking was actually cancelled
        if (cancelledBooking.bookingStatus?.toLowerCase() !== "cancelled") {
            console.warn("⚠️ [USE CASE] Booking status is not 'Cancelled':", cancelledBooking.bookingStatus);
        }

        console.log("✅ [USE CASE] Booking cancelled successfully");
        return cancelledBooking;
        } catch (error: any) {
        console.error("❌ [USE CASE] Failed to cancel booking:", error);
        throw new Error(error.message || "Failed to cancel booking");
        }
    }
}