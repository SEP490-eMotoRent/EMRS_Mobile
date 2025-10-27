import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetBookingsByRenterUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(renterId: string): Promise<Booking[]> {
        return await this.bookingRepository.getByRenter(renterId);
    }
}