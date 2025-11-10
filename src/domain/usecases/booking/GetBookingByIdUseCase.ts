import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetBookingByIdUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(bookingId: string): Promise<Booking | null> {
        console.log("🔍 Fetching booking by ID:", bookingId);
        
        try {
            const booking = await this.bookingRepository.getById(bookingId);
            
            if (booking) {
                console.log("✅ Booking found:", {
                    id: booking.id,
                    status: booking.bookingStatus,
                    vehicleModel: booking.vehicleModelId,
                });
            } else {
                console.warn("⚠️ Booking not found:", bookingId);
            }
            
            return booking;
        } catch (error: any) {
            console.error("❌ Error fetching booking:", error);
            throw error;
        }
    }
}