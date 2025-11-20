import { useState } from "react";
import sl from "../../../../../core/di/InjectionContainer";

export const useCancelWithdrawalRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelUseCase = sl.getCancelWithdrawalRequestUseCase();

    const cancelRequest = async (requestId: string) => {
        setLoading(true);
        setError(null);

        try {
        const result = await cancelUseCase.execute(requestId);
        return result;
        } catch (err: any) {
        const errorMessage = err.message || "Không thể hủy yêu cầu";
        setError(errorMessage);
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return {
        cancelRequest,
        loading,
        error,
    };
};