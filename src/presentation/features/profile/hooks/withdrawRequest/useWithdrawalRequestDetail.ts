import { useCallback, useEffect, useState } from "react";
import sl from "../../../../../core/di/InjectionContainer";
import { WithdrawalRequest } from "../../../../../domain/entities/financial/WithdrawalRequest";

    export const useWithdrawalRequestDetail = (requestId: string) => {
    const [request, setRequest] = useState<WithdrawalRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getDetailUseCase = sl.getGetWithdrawalRequestDetailUseCase();

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
        const result = await getDetailUseCase.execute(requestId);
        setRequest(result);
        } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết yêu cầu");
        } finally {
        setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    return {
        request,
        loading,
        error,
        refresh: fetchDetail,
    };
};