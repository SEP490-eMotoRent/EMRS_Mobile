import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';
import { InsuranceClaimDetailResponse } from '../../../../../data/models/insurance/insuranceClaim/InsuranceClaimDetailResponse';

export const useInsuranceClaimDetail = (claimId: string) => {
    const [claim, setClaim] = useState<InsuranceClaimDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClaimDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await container.insurance.claims.getDetail.execute(claimId);
            setClaim(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải chi tiết yêu cầu');
        } finally {
            setLoading(false);
        }
    }, [claimId]);

    useEffect(() => {
        fetchClaimDetail();
    }, [fetchClaimDetail]);

    return {
        claim,
        loading,
        error,
        refresh: fetchClaimDetail,
    };
};