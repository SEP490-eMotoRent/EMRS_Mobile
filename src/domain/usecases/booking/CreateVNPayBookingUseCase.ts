import { Renter } from "../../entities/account/Renter";
import { Booking } from "../../entities/booking/Booking";
import { VehicleModel } from "../../entities/vehicle/VehicleModel";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export interface CreateVNPayBookingInput {
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
    totalRentalFee?: number;  // ← Make optional
    renterId: string;
}

export interface VNPayBookingResultWithExpiry {
    booking: Booking;
    vnpayUrl: string;
    expiresAt: string; // ISO string - 15 minutes from creation
}

export class CreateVNPayBookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(input: CreateVNPayBookingInput): Promise<VNPayBookingResultWithExpiry> {
        // Create mock renter
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

        // Create mock vehicle model
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

        // Construct Booking entity
        const booking = new Booking(
            "", // id - will be set by backend
            "", // bookingCode - will be set by backend
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
            "Pending", // bookingStatus - VNPay creates as Pending
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
            null,
            null,
            false
        );

        console.log("🎫 Creating VNPay booking...");
        
        // Call repository to create VNPay booking
        const result = await this.bookingRepository.createVNPay(booking);
        
        console.log("✅ VNPay booking created:", result.booking.id);
        console.log("🔗 Payment URL:", result.vnpayUrl);

        // Calculate expiry time (15 minutes from now)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        return {
            booking: result.booking,
            vnpayUrl: result.vnpayUrl,
            expiresAt,
        };
    }
}