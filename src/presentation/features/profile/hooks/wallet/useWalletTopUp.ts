import { useMemo, useState } from 'react';
import sl from '../../../../../core/di/InjectionContainer';
import { WalletTopUpResponse } from '../../../../../data/models/wallet/topUp/WalletTopUpResponse';
import { CreateTopUpRequestUseCase } from '../../../../../domain/usecases/wallet/topUp/CreateTopUpRequestUseCase';


export const useWalletTopUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTopUpRequestUseCase = useMemo(
        () => sl.get<CreateTopUpRequestUseCase>('CreateTopUpRequestUseCase'),
        []
    );

    const createTopUpRequest = async (amount: number): Promise<WalletTopUpResponse> => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🚀 Creating top-up request:', amount);
            const result = await createTopUpRequestUseCase.execute({ amount }); // ← Pass object
            console.log('✅ Top-up request created:', result.transactionId);
            
            return result;
        } catch (err: any) {
            console.error('❌ Top-up request error:', err);
            const errorMessage = err.message || 'Không thể tạo yêu cầu nạp tiền';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createTopUpRequest, loading, error };
};