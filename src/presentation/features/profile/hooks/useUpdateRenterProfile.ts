import { useState } from 'react';
import sl from '../../../../core/di/InjectionContainer';
import { UpdateRenterResponse } from '../../../../data/models/account/renter/update/RenterAccountUpdateResponse';
import { UpdateRenterRequest } from '../../../../data/models/account/renter/update/UpdateRenterRequest';


/**
 * Hook for updating renter profile
 * Simplified - no more FormData handling at this level
 */
export const useUpdateRenterProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const updateUseCase = sl.getUpdateRenterProfileUseCase();

    const update = async (data: UpdateRenterRequest): Promise<UpdateRenterResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await updateUseCase.execute(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update profile';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};