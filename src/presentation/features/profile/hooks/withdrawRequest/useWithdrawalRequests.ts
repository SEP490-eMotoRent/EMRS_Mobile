import { useCallback, useEffect, useState } from "react";
import sl from "../../../../../core/di/InjectionContainer";
import { WithdrawalRequest } from "../../../../../domain/entities/financial/WithdrawalRequest";

export const useWithdrawalRequests = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMyRequestsUseCase = sl.getGetMyWithdrawalRequestsUseCase();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyRequestsUseCase.execute();
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