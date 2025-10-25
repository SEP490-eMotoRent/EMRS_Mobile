import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { BookingResponse } from "../../../../models/booking/BookingResponse";

export interface BookingRemoteDataSource {
    create(request: CreateBookingRequest): Promise<BookingResponse>;
    getById(id: string): Promise<BookingResponse | null>;
    getByRenter(renterId: string): Promise<BookingResponse[]>;
    getCurrentRenterBookings(): Promise<BookingResponse[]>;

}