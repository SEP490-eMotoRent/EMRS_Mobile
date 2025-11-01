// src/features/profile/hooks/useRenterProfile.ts
import { useEffect, useState } from 'react';
import { Renter } from '../../../../domain/entities/account/Renter';
import { RenterResponse } from '../../../../data/models/account/renter/RenterResponse';
import sl from '../../../../core/di/InjectionContainer';
import { useAppSelector } from '../../authentication/store/hooks';

export const useRenterProfile = () => {
    const token = useAppSelector((state) => state.auth.token);
    const [renter, setRenter] = useState<Renter | null>(null);
    const [renterResponse, setRenterResponse] = useState<RenterResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRenterProfile = async () => {
        if (!token) {
            setError('No authentication token');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Single fetch using the use case
            const getCurrentRenterUseCase = sl.getGetCurrentRenterUseCase();
            const result = await getCurrentRenterUseCase.execute();

            setRenter(result.renter);
            setRenterResponse(result.rawResponse);
        } catch (err: any) {
            console.error('Failed to fetch renter profile:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRenterProfile();
    }, [token]);

    const refresh = async () => {
        await fetchRenterProfile();
    };

    return {
        renter,
        renterResponse,
        loading,
        error,
        refresh,
    };
};