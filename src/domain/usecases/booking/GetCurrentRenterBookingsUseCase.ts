import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class GetCurrentRenterBookingsUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(): Promise<Booking[]> {
        return await this.bookingRepository.getCurrentRenterBookings();
    }
}