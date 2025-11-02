import { useState } from 'react';
import sl from '../../../../../core/di/InjectionContainer';
import { DocumentCreateRequest } from '../../../../../data/models/account/document/DocumentCreateRequest';
import { DocumentDetailResponse } from '../../../../../data/models/account/document/DocumentDetailResponse';


export const useCreateDocument = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const createCitizenDocumentUseCase = sl.getCreateCitizenDocumentUseCase();
    const createDrivingDocumentUseCase = sl.getCreateDrivingDocumentUseCase();

    const createCitizen = async (data: DocumentCreateRequest): Promise<DocumentDetailResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await createCitizenDocumentUseCase.execute(data);
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
            const response = await createDrivingDocumentUseCase.execute(data);
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