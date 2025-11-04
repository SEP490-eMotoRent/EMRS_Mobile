import { useState } from 'react';
import sl from '../../../../../core/di/InjectionContainer';
import { CreateInsuranceClaimRequest } from '../../../../../data/models/insurance/insuranceClaim/CreateInsuranceClaimRequest';
import { InsuranceClaimResponse } from '../../../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse';

interface UseCreateInsuranceClaimResult {
    isLoading: boolean;
    error: string | null;
    createClaim: (request: CreateInsuranceClaimRequest) => Promise<InsuranceClaimResponse | null>;
    reset: () => void;
}

export const useCreateInsuranceClaim = (): UseCreateInsuranceClaimResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createClaim = async (
        request: CreateInsuranceClaimRequest
    ): Promise<InsuranceClaimResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
        const createInsuranceClaimUseCase = sl.getCreateInsuranceClaimUseCase();
        const result = await createInsuranceClaimUseCase.execute(request);
        setIsLoading(false);
        return result;
        } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create insurance claim';
        setError(errorMessage);
        setIsLoading(false);
        return null;
        }
    };

    const reset = () => {
        setError(null);
        setIsLoading(false);
    };

    return {
        isLoading,
        error,
        createClaim,
        reset,
    };
};