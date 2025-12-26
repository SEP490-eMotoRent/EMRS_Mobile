import { useEffect, useRef } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';

interface UseTransactionStatusPollingParams {
    transactionId: string;
    enabled: boolean;
    onStatusChange: (status: string) => void;
    pollingInterval?: number;
    maxDuration?: number;
}

/**
 * Hook to poll transaction status periodically
 * Similar to useBookingStatusPolling but for wallet transactions
 * 
 * @param transactionId - Transaction ID to poll
 * @param enabled - Whether polling is enabled
 * @param onStatusChange - Callback when transaction status changes
 * @param pollingInterval - Interval between polls in milliseconds (default: 3000ms)
 * @param maxDuration - Maximum duration to poll in milliseconds (default: 15 minutes)
 */
export const useTransactionStatusPolling = ({
    transactionId,
    enabled,
    onStatusChange,
    pollingInterval = 3000,
    maxDuration = 15 * 60 * 1000,
}: UseTransactionStatusPollingParams) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const lastKnownStatusRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            // console.log('⏸️ [TRANSACTION POLLING] Disabled');
            return;
        }

        // console.log('▶️ [TRANSACTION POLLING] Starting for transaction:', transactionId);
        startTimeRef.current = Date.now();

        const pollTransactionStatus = async () => {
            try {
                const elapsed = Date.now() - startTimeRef.current;

                // Check if max duration exceeded
                if (elapsed >= maxDuration) {
                    // console.log('⏱️ [TRANSACTION POLLING] Max duration reached, stopping');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    onStatusChange('Failed'); // Treat timeout as failure
                    return;
                }

                // console.log('📡 [TRANSACTION POLLING] Fetching transaction status...');

                // Fetch transaction details from backend
                // Note: We need to get transaction by renterId and filter by transactionId
                const transactions = await container.transaction.getByRenterId.execute();
                
                const transaction = transactions.find(t => t.id === transactionId);

                if (!transaction) {
                    // console.warn('⚠️ [TRANSACTION POLLING] Transaction not found:', transactionId);
                    return;
                }

                const currentStatus = transaction.status;
                // console.log('📊 [TRANSACTION POLLING] Current status:', currentStatus);

                // Only trigger callback if status changed
                if (currentStatus !== lastKnownStatusRef.current) {
                    // console.log('🔄 [TRANSACTION POLLING] Status changed:', {
                    //     from: lastKnownStatusRef.current,
                    //     to: currentStatus,
                    // });

                    lastKnownStatusRef.current = currentStatus;
                    onStatusChange(currentStatus);

                    // Stop polling if transaction is in final state
                    if (['Success', 'Failed', 'Cancelled'].includes(currentStatus)) {
                        // console.log('✅ [TRANSACTION POLLING] Final status reached, stopping');
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    }
                }
            } catch (error: any) {
                // console.error('❌ [TRANSACTION POLLING] Error:', error);
                // Don't stop polling on error, just log it
            }
        };

        // Initial poll
        pollTransactionStatus();

        // Set up interval
        intervalRef.current = setInterval(pollTransactionStatus, pollingInterval);

        // Cleanup
        return () => {
            // console.log('🛑 [TRANSACTION POLLING] Cleanup');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [transactionId, enabled, pollingInterval, maxDuration, onStatusChange]);
};