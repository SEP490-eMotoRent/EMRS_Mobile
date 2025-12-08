import { useCallback, useEffect, useMemo, useState } from "react";
import sl from "../../../../../../core/di/InjectionContainer";
import { GetBookingByIdUseCase } from "../../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { GetListRentalReceiptUseCase } from "../../../../../../domain/usecases/receipt/GetListRentalReceipt";
import { Booking } from "../../../../../../domain/entities/booking/Booking";
import { RentalReceipt } from "../../../../../../domain/entities/booking/RentalReceipt";
import { useBookingDetails } from '../../../../tripDetails/hooks/useBookingDetails';

interface UseGetLastReceiptParams {
  bookingId?: string;
}

export const useGetLastReceipt = ({
  bookingId,
}: UseGetLastReceiptParams) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!bookingId) return;
    try {
      setLoadingBooking(true);
      const getBookingByIdUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );
      const bookingData = await getBookingByIdUseCase.execute(bookingId);
      setBooking(bookingData);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoadingBooking(false);
    }
  }, [bookingId]);

  const getLastReceipt = useCallback((): RentalReceipt | null => {
    const receipts = booking?.rentalReceipts || [];
    if (!receipts.length) return null;

    const bookingVehicleId = booking?.vehicle?.id || booking?.vehicleId || null;
    if (!bookingVehicleId) {
      return receipts[receipts.length - 1];
    }

    const matched = [...receipts].reverse().find((r) => {
      const id = r?.vehicle?.id || r?.booking?.vehicle?.id || null;
      return id === bookingVehicleId;
    });

    return matched || receipts[receipts.length - 1];
  }, [booking]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return useMemo(
    () => ({
      booking,
      loadingBooking,
      fetchBooking,
      getLastReceipt,
    }),
    [
      booking,
      loadingBooking,
      fetchBooking,
      getLastReceipt,
    ]
  );
};

