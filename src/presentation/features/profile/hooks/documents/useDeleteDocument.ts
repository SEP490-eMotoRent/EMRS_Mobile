import { useState } from 'react';
import { container } from '../../../../../core/di/ServiceContainer';

export const useDeleteDocument = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDocument = async (documentId: string): Promise<string> => {
        setLoading(true);
        setError(null);
        
        try {
            // ✅ MIGRATED: Use ServiceContainer instead of InjectionContainer
            const response = await container.account.documents.delete.execute(documentId);
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