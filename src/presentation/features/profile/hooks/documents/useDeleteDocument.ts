import { useState } from 'react';
import sl from '../../../../../core/di/InjectionContainer';

export const useDeleteDocument = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const deleteDocumentUseCase = sl.getDeleteDocumentUseCase();

    const deleteDocument = async (documentId: string): Promise<string> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await deleteDocumentUseCase.execute(documentId);
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to delete document';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteDocument, loading, error };
};