// src/features/account/profile/hooks/useRenterProfile.ts

import { useEffect, useState } from 'react';
import { 
    RenterResponse, 
    AvatarMediaResponse 
} from '../../../../../data/models/account/renter/RenterResponse';
import { Renter } from '../../../../../domain/entities/account/Renter';
import { Membership } from '../../../../../domain/entities/financial/Membership';
import { useAppDispatch, useAppSelector } from '../../../authentication/store/hooks';
import { container } from '../../../../../core/di/ServiceContainer';
import { removeAuth } from '../../../authentication/store/slices/authSlice';

export const useRenterProfile = () => {
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [renter, setRenter] = useState<Renter | null>(null);
    const [renterResponse, setRenterResponse] = useState<RenterResponse | null>(null);
    const [avatarMediaId, setAvatarMediaId] = useState<string | null>(null); // NEW
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

            const result = await container.account.profile.getCurrent.execute();

            const raw = result.rawResponse;

            // Extract avatar info from new format
            const avatarObj = raw.avatar as AvatarMediaResponse | null;
            const avatarUrl = avatarObj?.fileUrl || null;
            const mediaId = avatarObj?.id || null;

            setAvatarMediaId(mediaId);

            // Keep old fields for backward compatibility
            const normalizedResponse: RenterResponse = {
                ...raw,
                avatar: avatarObj,
            };

            setRenterResponse(normalizedResponse);
            setRenter(result.renter);

        } catch (err: any) {
            dispatch(removeAuth());
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
        avatarMediaId,
        loading,
        error,
        refresh,
        membership,
        membershipTier,
        membershipDiscount,
    };
};