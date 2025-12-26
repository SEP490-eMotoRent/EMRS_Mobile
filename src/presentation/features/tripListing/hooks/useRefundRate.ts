import { useState, useEffect } from 'react';
import container from '../../../../core/di/ServiceContainer';
import { ConfigurationType } from '../../../../domain/entities/configuration/ConfigurationType';

/**
 * Hook to fetch the RefundRate configuration
 * Type 7 = RefundRate (Tỷ lệ hoàn tiền)
 * 
 * Returns the refund rate as a decimal (e.g., 1.0 = 100%, 0.8 = 80%)
 */
export const useRefundRate = () => {
    const [refundRate, setRefundRate] = useState<number>(1.0); // Default 100%
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRefundRate = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch RefundRate configuration (type 7)
                const configs = await container.configuration.getByType.execute(
                    ConfigurationType.RefundRate
                );

                if (configs.length > 0) {
                    const rateValue = parseFloat(configs[0].value);
                    if (!isNaN(rateValue)) {
                        setRefundRate(rateValue);
                    }
                }
            } catch (err: any) {
                console.error('Failed to fetch refund rate:', err);
                setError(err.message || 'Failed to fetch refund rate');
                // Keep default 1.0 on error
            } finally {
                setLoading(false);
            }
        };

        fetchRefundRate();
    }, []);

    return { refundRate, loading, error };
};