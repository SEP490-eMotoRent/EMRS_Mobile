import { useState } from 'react';
import { UpdateRenterResponse } from '../../../../../data/models/account/renter/update/RenterAccountUpdateResponse';
import { UpdateRenterRequest } from '../../../../../data/models/account/renter/update/UpdateRenterRequest';
import { container } from '../../../../../core/di/ServiceContainer';

/**
 * Hook for updating renter profile
 * Simplified - no more FormData handling at this level
 */
export const useUpdateRenterProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (data: UpdateRenterRequest): Promise<UpdateRenterResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await container.account.profile.update.execute(data);
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