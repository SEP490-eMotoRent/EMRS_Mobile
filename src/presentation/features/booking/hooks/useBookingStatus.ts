import { useEffect, useRef, useState } from "react";
import { Booking } from "../../../../domain/entities/booking/Booking";
import { container } from "../../../../core/di/ServiceContainer";

interface UseBookingStatusOptions {
    bookingId: string;
    pollingInterval?: number;
    onStatusChange?: (status: string, booking: Booking) => void;
    enabled?: boolean;
}

export const useBookingStatus = ({
    bookingId,
    pollingInterval = 3000,
    onStatusChange,
    enabled = true,
}: UseBookingStatusOptions) => {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const previousStatusRef = useRef<string | null>(null);

    const checkBookingStatus = async () => {
        try {
            setError(null);
            const result = await container.booking.get.byId.execute(bookingId);
            
            if (result) {
                setBooking(result);
                setLoading(false);

                const currentStatus = result.bookingStatus;
                if (previousStatusRef.current !== null && 
                    previousStatusRef.current !== currentStatus) {
                    console.log(`📊 Booking status changed: ${previousStatusRef.current} → ${currentStatus}`);
                    onStatusChange?.(currentStatus, result);
                }
                previousStatusRef.current = currentStatus;
            }
        } catch (err: any) {
            console.error("❌ Error checking booking status:", err);
            setError(err.message || "Failed to check booking status");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) {
            return;
        }

        checkBookingStatus();
        intervalRef.current = setInterval(checkBookingStatus, pollingInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [bookingId, pollingInterval, enabled]);

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const refreshStatus = async () => {
        await checkBookingStatus();
    };

    return {
        booking,
        loading,
        error,
        stopPolling,
        refreshStatus,
    };
};