import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetBookingByIdUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(bookingId: string): Promise<Booking | null> {
        try {
            const booking = await this.bookingRepository.getById(bookingId);

            
            return booking;
        } catch (error: any) {
            console.error("❌ Error fetching booking:", error);
            throw error;
        }
    }
}