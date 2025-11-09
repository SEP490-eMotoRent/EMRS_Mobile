import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

/**
 * Fetches full booking details by ID
 * Use this after VNPay payment to check if booking status changed to "Booked"
 */
export class GetBookingByIdUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    /**
     * Get booking with full details
     * @param bookingId - The booking ID
     * @returns Full booking entity with navigation properties populated
     */
    async execute(bookingId: string): Promise<Booking | null> {
        if (!bookingId) {
            throw new Error("Booking ID is required");
        }

        const booking = await this.bookingRepository.getById(bookingId);
        
        if (!booking) {
            console.warn(`⚠️ Booking not found: ${bookingId}`);
            return null;
        }

        console.log("✅ Booking fetched:", {
            id: booking.id,
            status: booking.bookingStatus,
            hasVehicle: booking.vehicleId !== undefined,
            hasFullDetails: booking.hasFullDetails()
        });

        return booking;
    }

    /**
     * Check if booking payment is complete
     * @param bookingId - The booking ID
     * @returns true if booking status is "Booked", false otherwise
     */
    async isPaymentComplete(bookingId: string): Promise<boolean> {
        const booking = await this.execute(bookingId);
        return booking?.isBooked() ?? false;
    }

    /**
     * Wait for payment confirmation with polling
     * @param bookingId - The booking ID
     * @param maxAttempts - Maximum number of poll attempts (default: 20)
     * @param intervalMs - Interval between polls in milliseconds (default: 3000)
     * @returns The booking if payment confirmed, null if timeout or failed
     */
    async waitForPaymentConfirmation(
        bookingId: string,
        maxAttempts: number = 20,
        intervalMs: number = 3000
    ): Promise<Booking | null> {
        console.log(`🔄 Starting payment confirmation poll for booking ${bookingId}`);
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`📡 Poll attempt ${attempt}/${maxAttempts}`);
            
            const booking = await this.execute(bookingId);
            
            if (!booking) {
                console.error("❌ Booking not found");
                return null;
            }
            
            // Check if payment succeeded
            if (booking.isBooked()) {
                console.log("✅ Payment confirmed! Booking status: Booked");
                return booking;
            }
            
            // Check if booking was cancelled/failed
            if (booking.isCancelled()) {
                console.log("❌ Booking was cancelled");
                return null;
            }
            
            // Check if booking expired
            if (booking.isExpired()) {
                console.log("⏰ Booking expired");
                return null;
            }
            
            // Still pending, continue polling
            if (attempt < maxAttempts) {
                console.log(`⏳ Still pending, waiting ${intervalMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
        
        console.warn("⏰ Payment confirmation timeout");
        return null;
    }
}