import { useState, useEffect, useCallback, useRef } from 'react';
import { Branch } from '../../../../domain/entities/operations/Branch';
import sl from '../../../../core/di/InjectionContainer';

export const useBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const isMountedRef = useRef<boolean>(true);

    const fetchBranches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Fetching branches...');
            const getAllBranchesUseCase = sl.GetAllBranchesUseCase();
            const fetchedBranches = await getAllBranchesUseCase.execute();
            
            if (isMountedRef.current) {
                setBranches(fetchedBranches);
                console.log('✅ Branches loaded:', fetchedBranches.length);
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError(err instanceof Error ? err.message : 'Failed to fetch branches');
                console.error('❌ Error fetching branches:', err);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchBranches();
        
        return () => {
            isMountedRef.current = false;
        };
    }, [fetchBranches]);

    return { branches, loading, error, refetch: fetchBranches };
};