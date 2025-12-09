import { useState } from "react";
import { container } from "../../../../../core/di/ServiceContainer";

export const useCancelWithdrawalRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelRequest = async (requestId: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await container.wallet.withdrawal.cancel.execute(requestId);
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