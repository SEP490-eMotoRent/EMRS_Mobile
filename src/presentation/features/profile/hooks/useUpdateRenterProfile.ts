import { useState } from 'react';
import sl from '../../../../core/di/InjectionContainer';
import { UpdateRenterProfileUseCase } from '../../../../domain/usecases/account/Profile/UpdateRenterProfileUseCase';

export const useUpdateRenterProfile = () => {
    const [loading, setLoading] = useState(false);
    const updateUseCase = sl.getUpdateRenterProfileUseCase();

    const update = async (data: {
        email: string;
        phone: string;
        address: string;
        dateOfBirth: string;
        mediaId: string;
        fullname: string;
        profilePicture?: any;
    }) => {
        setLoading(true);
        try {
        const request: any = {
            email: data.email,
            phone: data.phone,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            mediaId: data.mediaId,
            fullname: data.fullname,
        };

        if (data.profilePicture) {
            const formData = new FormData();
            Object.keys(request).forEach(key => {
            formData.append(key, request[key]);
            });
            formData.append('profilePicture', data.profilePicture);
            await updateUseCase.execute(formData);
        } else {
            await updateUseCase.execute(request);
        }
        } finally {
        setLoading(false);
        }
    };

    return { update, loading };
};