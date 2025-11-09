import { Booking } from "../../entities/booking/Booking";
import { BookingRepository, VNPayBookingResult } from "../../repositories/booking/BookingRepository";

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
    totalRentalFee: number;
    renterId: string;
}

/**
 * Enhanced result with payment expiry time
 */
export interface VNPayBookingResultWithExpiry extends VNPayBookingResult {
    expiresAt: Date;
}

/**
 * Creates VNPay booking with duplicate check and expiry tracking
 */
export class CreateVNPayBookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    /**
     * Creates a VNPay booking with minimal data
     * Returns booking entity (IDs only) + VNPay payment URL + expiry time
     * 
     * ⚠️ Important: The returned booking entity will have undefined navigation properties
     * Frontend should fetch full details after payment using getById()
     */
    async execute(input: CreateVNPayBookingInput): Promise<VNPayBookingResultWithExpiry> {
        // ✅ Validate input
        this.validateInput(input);

        // ✅ Check for duplicate pending bookings
        await this.checkForDuplicateBooking(input.renterId, input.vehicleModelId);

        // ✅ Create booking entity WITHOUT navigation objects
        const booking = new Booking(
            "", // id - assigned by backend
            "", // bookingCode - assigned by backend
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
            input.vehicleModelId,
            input.renterId,
            undefined, // renter - Backend will populate
            undefined, // vehicleModel - Backend will populate
            undefined, // vehicleId - Assigned after payment
            undefined, // vehicle
            input.startDatetime,
            input.endDatetime,
            undefined, // actualReturnDatetime
            input.insurancePackageId,
            undefined, // insurancePackage
            undefined, // rentalContract
            undefined, // rentalReceipts (collection)
            input.handoverBranchId,
            undefined, // handoverBranch
            undefined, // returnBranchId
            undefined, // returnBranch
            undefined, // feedback
            undefined, // insuranceClaims (collection)
            undefined, // additionalFees (collection)
            undefined, // chargingRecords (collection)
            new Date(), // createdAt
            null,
            null,
            false
        );

        // ✅ Create booking via repository
        const result = await this.bookingRepository.createVNPay(booking);

        console.log("✅ VNPay booking created:", {
            bookingId: result.booking.id,
            status: result.booking.bookingStatus,
            vnpayUrl: result.vnpayUrl
        });

        // ✅ Add expiry time (15 minutes from now)
        return {
            ...result,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        };
    }

    /**
     * Check if user already has a pending VNPay booking for the same vehicle model
     */
    private async checkForDuplicateBooking(renterId: string, vehicleModelId: string): Promise<void> {
        const existingBookings = await this.bookingRepository.getCurrentRenterBookings();
        
        const hasPendingBooking = existingBookings.some(booking => 
            booking.isPending() && 
            booking.vehicleModelId === vehicleModelId &&
            !booking.isExpired()
        );
        
        if (hasPendingBooking) {
            throw new Error(
                "You already have a pending booking for this vehicle model. " +
                "Please complete the payment or wait for it to expire."
            );
        }
    }

    /**
     * Validates booking input
     * @throws Error if validation fails
     */
    private validateInput(input: CreateVNPayBookingInput): void {
        if (!input.startDatetime || !input.endDatetime) {
            throw new Error("Start and end datetime are required");
        }

        if (input.startDatetime >= input.endDatetime) {
            throw new Error("End datetime must be after start datetime");
        }

        if (input.depositAmount <= 0) {
            throw new Error("Deposit amount must be greater than 0");
        }

        if (input.totalRentalFee <= 0) {
            throw new Error("Total rental fee must be greater than 0");
        }

        if (!input.vehicleModelId || !input.renterId || !input.handoverBranchId) {
            throw new Error("Vehicle model, renter, and handover branch are required");
        }
    }
}