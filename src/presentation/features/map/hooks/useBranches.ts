import { useState, useEffect } from 'react';
import { Branch } from '../../../../domain/entities/operations/Branch';
import sl from '../../../../core/di/InjectionContainer';

export const useBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            setError(null);
            const getAllBranchesUseCase = sl.GetAllBranchesUseCase();
            const fetchedBranches = await getAllBranchesUseCase.execute();
            setBranches(fetchedBranches);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch branches');
            console.error('Error fetching branches:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    return { branches, loading, error, refetch: fetchBranches };
};