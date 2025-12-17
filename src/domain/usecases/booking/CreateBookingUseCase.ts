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
    // REMOVED: renterId - backend extracts it from JWT token
}

export class CreateBookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(input: CreateBookingInput): Promise<Booking> {
        // Backend will populate renterId from JWT, so we use placeholder for frontend entity
        const placeholderRenterId = ""; // Backend will replace this
        
        // Create mock renter (to be populated by backend after creation)
        const mockRenter = new Renter(
            placeholderRenterId,
            "unknown@email.com",
            "",
            "",
            placeholderRenterId,
            "mock-membership",
            false,
            ""
        );

        // Create mock vehicle model (to be populated by backend after creation)
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
            "", // id - backend generates
            "", // bookingCode - backend generates
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
            placeholderRenterId, // renterId - backend populates from JWT
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
        
        // Repository sends data to backend, which returns proper Booking with renterId populated
        return await this.bookingRepository.create(booking);
    }
}