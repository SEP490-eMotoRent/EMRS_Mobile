import { useEffect, useRef, useState } from 'react';
import { container } from '../../../../core/di/ServiceContainer';

interface UseBookingStatusPollingOptions {
    bookingId: string;
    enabled: boolean;
    onStatusChange: (status: string) => void;
    pollingInterval?: number;
    maxDuration?: number;
}

/**
 * Hook to poll booking status in the background
 * 
 * Use case: Fallback mechanism when deep links fail
 * - Polls every 3 seconds by default
 * - Stops after 15 minutes or when terminal status reached
 * - Detects status changes and notifies caller
 * 
 * @param bookingId - The booking ID to poll
 * @param enabled - Enable/disable polling
 * @param onStatusChange - Callback when status changes
 * @param pollingInterval - Time between polls (default: 3000ms)
 * @param maxDuration - Max polling duration (default: 15 min)
 */
export const useBookingStatusPolling = ({
    bookingId,
    enabled,
    onStatusChange,
    pollingInterval = 3000,
    maxDuration = 15 * 60 * 1000,
}: UseBookingStatusPollingOptions) => {
    const [lastKnownStatus, setLastKnownStatus] = useState<string>('');
    const [isPolling, setIsPolling] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        if (!enabled || !bookingId) {
            // Clear polling when disabled
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setIsPolling(false);
            }
            return;
        }

        console.log('🔄 [POLLING] Started for booking:', bookingId);
        console.log(`⏱️ [POLLING] Interval: ${pollingInterval}ms, Max duration: ${maxDuration / 1000}s`);
        
        startTimeRef.current = Date.now();
        setIsPolling(true);

        const pollStatus = async () => {
            try {
                const elapsed = Date.now() - startTimeRef.current;

                // Stop after max duration
                if (elapsed >= maxDuration) {
                    console.log('⏰ [POLLING] Timeout reached, stopping');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setIsPolling(false);
                    }
                    return;
                }

                console.log(`🔍 [POLLING] Checking status (${Math.floor(elapsed / 1000)}s elapsed)...`);
                
                const booking = await container.booking.get.byId.execute(bookingId);
                
                if (!booking) {
                    console.warn('⚠️ [POLLING] Booking not found');
                    return;
                }

                console.log('📊 [POLLING] Current status:', booking.bookingStatus);

                // Detect status change
                if (booking.bookingStatus !== lastKnownStatus && lastKnownStatus !== '') {
                    console.log('✨ [POLLING] Status changed:', lastKnownStatus, '→', booking.bookingStatus);
                    onStatusChange(booking.bookingStatus);
                }

                setLastKnownStatus(booking.bookingStatus);

                // Stop polling if terminal status reached
                if (booking.bookingStatus === 'Booked' || booking.bookingStatus === 'Cancelled') {
                    console.log('🎯 [POLLING] Terminal status reached, stopping');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setIsPolling(false);
                    }
                }

            } catch (error) {
                console.error('❌ [POLLING] Error:', error);
                // Continue polling even on error - network might recover
            }
        };

        // Initial poll
        pollStatus();

        // Set up interval
        intervalRef.current = setInterval(pollStatus, pollingInterval);

        // Cleanup
        return () => {
            console.log('🛑 [POLLING] Cleanup');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setIsPolling(false);
            }
        };
    }, [bookingId, enabled, pollingInterval, maxDuration, lastKnownStatus, onStatusChange]);

    return { 
        lastKnownStatus, 
        isPolling 
    };
};