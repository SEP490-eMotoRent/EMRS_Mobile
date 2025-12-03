import { Booking } from "../../entities/booking/Booking";
import { BookingRepository } from "../../repositories/booking/BookingRepository";
import { Renter } from "../../entities/account/Renter";
import { VehicleModel } from "../../entities/vehicle/VehicleModel";

export interface CreateBookingInput {
    startDatetime: Date;
    endDatetime: Date;
    handoverBranchId: string;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    vehicleModelId: string;
    averageRentalPrice: number;
    insurancePackageId?: string;
    totalRentalFee: number;
    renterId: string;
}

export class CreateBookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(input: CreateBookingInput): Promise<Booking> {
        // Create mock renter (to be populated by backend later)
        const mockRenter = new Renter(
            input.renterId,
            "unknown@email.com",
            "",
            "",
            input.renterId,
            "mock-membership",
            false,
            ""
        );

        // Create mock vehicle model (to be populated by backend later)
        const mockVehicleModel = new VehicleModel(
            input.vehicleModelId,
            "Unknown Model",
            "Unknown",
            0,
            0,
            0,
            "",
            "",
            undefined,
            new Date()
        );

        // Construct Booking entity in the correct order
        const booking = new Booking(
            "", // id
            "", // bookingCode
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
            undefined, // earlyHandoverFee
            input.totalRentalFee,
            input.totalRentalFee, // totalAmount
            0, // refundAmount
            "Pending", // bookingStatus
            input.vehicleModelId,
            input.renterId,
            mockRenter,
            mockVehicleModel,
            undefined, // vehicleId
            undefined, // vehicle
            input.startDatetime,
            input.endDatetime,
            undefined, // actualReturnDatetime
            input.insurancePackageId,
            undefined, // insurancePackage
            undefined, // rentalContract
            undefined, // rentalReceipts
            input.handoverBranchId,
            undefined, // handoverBranch
            undefined, // returnBranchId
            undefined, // returnBranch
            undefined, // feedback
            undefined, // insuranceClaims
            undefined, // additionalFees
            undefined, // chargingRecords
            new Date(), // createdAt
            null, // updatedAt
            null, // deletedAt
            false // isDeleted
        );
        
        return await this.bookingRepository.create(booking);
    }
}