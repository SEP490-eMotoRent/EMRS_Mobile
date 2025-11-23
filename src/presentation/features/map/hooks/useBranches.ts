import { useState, useEffect, useCallback, useRef } from 'react';
import { Branch } from '../../../../domain/entities/operations/Branch';
import sl from '../../../../core/di/InjectionContainer';

export const useBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const isMountedRef = useRef<boolean>(true);
    const hasFetchedRef = useRef<boolean>(false); // ✅ Prevent multiple fetches

    const fetchBranches = useCallback(async () => {
        // ✅ Don't fetch if already fetched successfully
        if (hasFetchedRef.current && branches.length > 0) {
            console.log('✅ Using cached branches');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Fetching branches...');
            const getAllBranchesUseCase = sl.GetAllBranchesUseCase();
            const fetchedBranches = await getAllBranchesUseCase.execute();
            
            if (isMountedRef.current) {
                setBranches(fetchedBranches);
                hasFetchedRef.current = true;
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
    }, [branches.length]);

    useEffect(() => {
        fetchBranches();
        
        return () => {
            isMountedRef.current = false;
        };
    }, []); // ✅ ONLY run once on mount

    return { branches, loading, error, refetch: fetchBranches };
};