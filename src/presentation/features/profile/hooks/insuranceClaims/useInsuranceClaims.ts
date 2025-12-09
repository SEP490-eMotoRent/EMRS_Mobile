import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';
import { InsuranceClaimResponse } from '../../../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse';

export const useInsuranceClaims = () => {
    const [claims, setClaims] = useState<InsuranceClaimResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClaims = useCallback(async () => {
        try {
            setError(null);
            const data = await container.insurance.claims.getMy.execute();
            setClaims(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải danh sách yêu cầu');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchClaims();
    }, [fetchClaims]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        fetchClaims();
    }, [fetchClaims]);

    return {
        claims,
        loading,
        refreshing,
        error,
        refresh,
    };
};