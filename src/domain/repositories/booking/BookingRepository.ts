import { Booking } from "../../entities/booking/Booking";

export interface BookingRepository {
    create(booking: Booking): Promise<Booking>;
    getById(id: string): Promise<Booking | null>;
    getByRenter(renterId: string): Promise<Booking[]>;
}