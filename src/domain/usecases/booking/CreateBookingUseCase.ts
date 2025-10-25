import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export interface CreateBookingInput {
    startDatetime: Date;
    endDatetime: Date;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    vehicleModelId: string;
    averageRentalPrice: number;
    totalRentalFee: number;
    renterId: string;
}

export class CreateBookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(input: CreateBookingInput): Promise<Booking> {
        // Create booking entity
        const booking = new Booking(
            "", // ID will be assigned by backend
            input.baseRentalFee,
            input.depositAmount,
            input.rentalDays,
            input.rentalHours,
            input.rentingRate,
            0, // lateReturnFee
            input.averageRentalPrice,
            0, // excessKmFee
            0, // cleaningFee
            0, // crossBranchFee
            0, // totalChargingFee
            0, // totalAdditionalFee
            input.totalRentalFee,
            input.totalRentalFee, // totalAmount
            0, // refundAmount
            "Pending", // bookingStatus
            input.renterId,
            input.vehicleModelId,
            {} as any, // renter (mock)
            {} as any, // vehicle (mock)
            input.startDatetime,
            input.endDatetime
        );

        // Save via repository
        return await this.bookingRepository.create(booking);
    }
}