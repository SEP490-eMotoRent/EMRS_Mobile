import { useState } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';
import { DocumentDetailResponse } from '../../../../../data/models/account/document/DocumentDetailResponse';
import { DocumentUpdateRequest } from '../../../../../data/models/account/document/DocumentUpdateRequest';

export const useUpdateDocument = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateCitizen = async (data: DocumentUpdateRequest): Promise<DocumentDetailResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            // ✅ MIGRATED: Use ServiceContainer instead of InjectionContainer
            const response = await container.account.documents.citizen.update.execute(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update citizen document';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDriving = async (data: DocumentUpdateRequest): Promise<DocumentDetailResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            // ✅ MIGRATED: Use ServiceContainer instead of InjectionContainer
            const response = await container.account.documents.driving.update.execute(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update driving document';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateCitizen, updateDriving, loading, error };
};