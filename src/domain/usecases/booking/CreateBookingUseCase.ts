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
        // Create mock renter (will be populated by backend)
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

        // Create mock vehicle model (will be populated by backend)
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

        // Create booking entity with CORRECT parameter order
        const booking = new Booking(
            "", // id - will be assigned by backend
            "", // ✅ bookingCode - will be assigned by backend
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
            input.vehicleModelId, // ✅ vehicleModelId (REQUIRED)
            input.renterId, // ✅ renterId (REQUIRED)
            mockRenter, // ✅ renter (REQUIRED)
            mockVehicleModel, // ✅ vehicleModel (REQUIRED)
            undefined, // vehicleId (OPTIONAL)
            undefined, // vehicle (OPTIONAL)
            input.startDatetime, // startDatetime
            input.endDatetime, // endDatetime
            undefined, // actualReturnDatetime
            input.insurancePackageId, // ✅ insurancePackageId (OPTIONAL)
            undefined, // insurancePackage (will be populated by backend)
            undefined, // rentalContract
            undefined, // rentalReceipt
            input.handoverBranchId, // ✅ handoverBranchId (OPTIONAL but we provide it)
            undefined, // handoverBranch
            undefined, // returnBranchId
            undefined, // returnBranch
            new Date(), // createdAt
            null, // updatedAt
            null, // deletedAt
            false // isDeleted
        );

        // Save via repository
        return await this.bookingRepository.create(booking);
    }
}