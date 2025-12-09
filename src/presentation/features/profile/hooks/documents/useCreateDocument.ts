import { useState } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';
import { DocumentCreateRequest } from '../../../../../data/models/account/document/DocumentCreateRequest';
import { DocumentDetailResponse } from '../../../../../data/models/account/document/DocumentDetailResponse';

export const useCreateDocument = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCitizen = async (data: DocumentCreateRequest): Promise<DocumentDetailResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            // ✅ MIGRATED: Use ServiceContainer instead of InjectionContainer
            const response = await container.account.documents.citizen.create.execute(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create citizen document';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createDriving = async (data: DocumentCreateRequest): Promise<DocumentDetailResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            // ✅ MIGRATED: Use ServiceContainer instead of InjectionContainer
            const response = await container.account.documents.driving.create.execute(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create driving document';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createCitizen, createDriving, loading, error };
};