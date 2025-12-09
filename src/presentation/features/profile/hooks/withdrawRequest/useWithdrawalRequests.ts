import { useCallback, useEffect, useState } from "react";
import { container } from "../../../../../core/di/ServiceContainer";
import { WithdrawalRequest } from "../../../../../domain/entities/financial/WithdrawalRequest";

export const useWithdrawalRequests = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await container.wallet.withdrawal.getMy.execute();
            setRequests(result);
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách yêu cầu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return {
        requests,
        loading,
        error,
        refresh: fetchRequests,
    };
};