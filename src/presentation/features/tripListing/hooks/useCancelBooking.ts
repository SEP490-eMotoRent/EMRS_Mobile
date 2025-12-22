import { useState } from 'react';
import { Alert } from 'react-native';
import { CancelBookingUseCase } from '../../../../domain/usecases/booking/CancelBookingUseCase';

/**
 * Hook for cancelling bookings
 * Handles loading states, errors, and success callbacks
 */
export const useCancelBooking = (useCase: CancelBookingUseCase) => {
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Cancel a booking with confirmation dialog
     * @param bookingId - ID of the booking to cancel
     * @param onSuccess - Callback to execute on successful cancellation
     */
    const cancelBooking = async (
        bookingId: string,
        onSuccess?: () => void
    ) => {
        // Show confirmation dialog
        Alert.alert(
            "Xác nhận hủy đặt xe",
            "Bạn có chắc chắn muốn hủy đặt xe này không? Hành động này không thể hoàn tác.",
            [
                {
                    text: "Không",
                    style: "cancel",
                },
                {
                    text: "Có, hủy đặt xe",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setCancelling(true);
                            setError(null);
                            
                            // console.log("🎯 [HOOK] Cancelling booking:", bookingId);
                            
                            await useCase.execute(bookingId);
                            
                            // console.log("✅ [HOOK] Booking cancelled successfully");
                            
                            // Show success message
                            Alert.alert(
                                "Đã hủy thành công",
                                "Đặt xe của bạn đã được hủy. Tiền đặt cọc sẽ được hoàn trả.",
                                [{ text: "OK" }]
                            );
                            
                            // Execute success callback (typically to refresh the list)
                            if (onSuccess) {
                                onSuccess();
                            }
                        } catch (err: any) {
                            console.error("❌ [HOOK] Failed to cancel booking:", err);
                            const errorMessage = err.message || 'Không thể hủy đặt xe. Vui lòng thử lại.';
                            setError(errorMessage);
                            
                            // Show error message
                            Alert.alert(
                                "Lỗi",
                                errorMessage,
                                [{ text: "OK" }]
                            );
                        } finally {
                            setCancelling(false);
                        }
                    },
                },
            ]
        );
    };

    /**
     * Cancel without confirmation dialog (for use in custom confirmation flows)
     */
    const cancelBookingDirect = async (
        bookingId: string,
        onSuccess?: () => void
    ) => {
        try {
            setCancelling(true);
            setError(null);
            
            // console.log("🎯 [HOOK] Cancelling booking directly:", bookingId);
            
            await useCase.execute(bookingId);
            
            // console.log("✅ [HOOK] Booking cancelled successfully");
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            console.error("❌ [HOOK] Failed to cancel booking:", err);
            const errorMessage = err.message || 'Không thể hủy đặt xe. Vui lòng thử lại.';
            setError(errorMessage);
            throw err;
        } finally {
            setCancelling(false);
        }
    };

    return {
        cancelBooking,
        cancelBookingDirect,
        cancelling,
        error,
    };
};