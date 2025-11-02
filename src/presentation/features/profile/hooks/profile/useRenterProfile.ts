// src/features/profile/hooks/useRenterProfile.ts
import { useEffect, useState } from 'react';
import { RenterResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { Renter } from '../../../../../domain/entities/account/Renter';
import { useAppSelector } from '../../../authentication/store/hooks';
import sl from '../../../../../core/di/InjectionContainer';


// NORMALIZE AVATAR URL - FIX THE ARRAY ISSUE HERE
const normalizeAvatarUrl = (url: any): string | null => {
    if (!url) return null;
    if (typeof url === 'string') return url;
    if (Array.isArray(url) && url.length > 0 && typeof url[0] === 'string') {
        return url[0];
    }
    return null;
};

// NORMALIZE RENTER RESPONSE - FIX AVATAR BEFORE IT SPREADS
const normalizeRenterResponse = (response: any): RenterResponse => {
    return {
        ...response,
        avatarUrl: normalizeAvatarUrl(response.avatarUrl)
    };
};

// NORMALIZE RENTER ENTITY - FIX AVATAR IN THE ENTITY TOO
const normalizeRenter = (renter: any): Renter => {
    return {
        ...renter,
        avatarUrl: normalizeAvatarUrl(renter.avatarUrl)
    };
};

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

            console.log('🔥 RAW API RESPONSE:', {
                avatarUrl: result.renter.avatarUrl,
                isArray: Array.isArray(result.renter.avatarUrl),
                rawResponseAvatar: result.rawResponse.avatarUrl,
                isRawArray: Array.isArray(result.rawResponse.avatarUrl)
            });

            // NORMALIZE THE DATA BEFORE SETTING STATE
            const normalizedRenter = normalizeRenter(result.renter);
            const normalizedResponse = normalizeRenterResponse(result.rawResponse);

            console.log('✅ NORMALIZED:', {
                avatarUrl: normalizedRenter.avatarUrl,
                isArray: Array.isArray(normalizedRenter.avatarUrl),
                responseAvatar: normalizedResponse.avatarUrl,
                isResponseArray: Array.isArray(normalizedResponse.avatarUrl)
            });

            setRenter(normalizedRenter);
            setRenterResponse(normalizedResponse);
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