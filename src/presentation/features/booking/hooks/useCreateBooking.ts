import { useState } from "react";
import { CreateBookingUseCase } from "../../../../domain/usecases/booking/CreateBookingUseCase";
import { Booking } from "../../../../domain/entities/booking/Booking";

export const useCreateBooking = (useCase: CreateBookingUseCase) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState<Booking | null>(null);

    const createBooking = async (input: {
        vehicleModelId: string;
        startDatetime: Date;
        endDatetime: Date;
        handoverBranchId: string;        // ✅ ADDED - Required
        rentalDays: number;
        rentalHours: number;
        baseRentalFee: number;
        depositAmount: number;
        rentingRate: number;
        averageRentalPrice: number;
        insurancePackageId?: string;     // ✅ ADDED - Optional
        totalRentalFee: number;
        renterId: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("🚀 Creating booking with:", JSON.stringify(input, null, 2));
            
            const result = await useCase.execute(input);
            
            console.log("✅ Booking created:", result.id);
            setBooking(result);
            return result;
        } catch (err: any) {
            console.error("❌ Booking creation error:", err);
            setError(err.message || "Failed to create booking");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createBooking, loading, error, booking };
};