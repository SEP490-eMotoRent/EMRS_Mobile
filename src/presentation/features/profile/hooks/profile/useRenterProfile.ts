import { useEffect, useState } from 'react';
import { MembershipResponse, RenterResponse } from '../../../../../data/models/account/renter/RenterResponse';
import { Renter } from '../../../../../domain/entities/account/Renter';
import { Membership } from '../../../../../domain/entities/financial/Membership';
import { useAppSelector } from '../../../authentication/store/hooks';
import sl from '../../../../../core/di/InjectionContainer';

// NORMALIZE AVATAR URL
const normalizeAvatarUrl = (url: any): string | null => {
    if (!url) return null;
    if (typeof url === 'string') return url;
    if (Array.isArray(url) && url.length > 0 && typeof url[0] === 'string') {
        return url[0];
    }
    return null;
};

// NORMALIZE RENTER RESPONSE
const normalizeRenterResponse = (response: any): RenterResponse => {
    return {
        ...response,
        avatarUrl: normalizeAvatarUrl(response.avatarUrl)
    };
};

// NORMALIZE RENTER ENTITY
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

            const getCurrentRenterUseCase = sl.getGetCurrentRenterUseCase();
            const result = await getCurrentRenterUseCase.execute();

            console.log('🔥 RAW API RESPONSE:', {
                avatarUrl: result.renter.avatarUrl,
                isArray: Array.isArray(result.renter.avatarUrl),
                rawResponseAvatar: result.rawResponse.avatarUrl,
                isRawArray: Array.isArray(result.rawResponse.avatarUrl),
                // ✅ NEW: Log membership
                membership: result.rawResponse.membership,
            });

            const normalizedRenter = normalizeRenter(result.renter);
            const normalizedResponse = normalizeRenterResponse(result.rawResponse);

            console.log('✅ NORMALIZED:', {
                avatarUrl: normalizedRenter.avatarUrl,
                isArray: Array.isArray(normalizedRenter.avatarUrl),
                responseAvatar: normalizedResponse.avatarUrl,
                isResponseArray: Array.isArray(normalizedResponse.avatarUrl),
                // ✅ NEW: Log membership
                membershipTier: normalizedResponse.membership?.tierName,
                membershipDiscount: normalizedResponse.membership?.discountPercentage,
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

    const membership = renterResponse?.membership || null;
    const membershipTier = membership?.tierName || 'BRONZE';
    const membershipDiscount = membership?.discountPercentage || 0;

    return {
        renter,
        renterResponse,
        loading,
        error,
        refresh,
        membership,
        membershipTier,
        membershipDiscount,
    };
};