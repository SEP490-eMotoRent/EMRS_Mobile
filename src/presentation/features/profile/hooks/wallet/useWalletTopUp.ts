import { useState } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';
import { WalletTopUpResponse } from '../../../../../data/models/wallet/topUp/WalletTopUpResponse';
import { WalletTopUpZaloPayResponse } from '../../../../../data/models/wallet/topUp/WalletTopUpZaloPayResponse';

export const useWalletTopUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create VNPay top-up request
     */
    const createTopUpRequest = async (amount: number): Promise<WalletTopUpResponse> => {
        try {
            setLoading(true);
            setError(null);
            // console.log('🚀 [VNPay] Creating top-up request:', amount);
            
            const result = await container.wallet.topUp.create.execute({ amount });
            // console.log('✅ [VNPay] Top-up request created:', result.transactionId);

            return result;
        } catch (err: any) {
            // console.error('❌ [VNPay] Top-up request error:', err);
            const errorMessage = err.message || 'Không thể tạo yêu cầu nạp tiền';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create ZaloPay top-up request
     */
    const createTopUpZaloPayRequest = async (amount: number): Promise<WalletTopUpZaloPayResponse> => {
        try {
            setLoading(true);
            setError(null);
            // console.log('🚀 [ZaloPay] Creating top-up request:', amount);
            
            const result = await container.wallet.topUp.createZaloPay.execute({ amount });
            // console.log('✅ [ZaloPay] Top-up request created:', result.transactionId);

            return result;
        } catch (err: any) {
            // console.error('❌ [ZaloPay] Top-up request error:', err);
            const errorMessage = err.message || 'Không thể tạo yêu cầu nạp tiền ZaloPay';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { 
        createTopUpRequest, 
        createTopUpZaloPayRequest,
        loading, 
        error 
    };
};