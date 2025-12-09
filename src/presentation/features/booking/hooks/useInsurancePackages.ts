import { useState, useEffect, useCallback } from 'react';
import { InsurancePackage } from '../../../../domain/entities/insurance/InsurancePackage';
import { container } from '../../../../core/di/ServiceContainer';

export interface UseInsurancePackagesResult {
    packages: InsurancePackage[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useInsurancePackages = (activeOnly: boolean = true): UseInsurancePackagesResult => {
    const [packages, setPackages] = useState<InsurancePackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPackages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await container.insurance.packages.getAll.execute({ activeOnly });
            setPackages(result);
        } catch (err: any) {
            console.error('Error fetching insurance packages:', err);
            setError(err.message || 'Failed to load insurance packages');
            setPackages([]);
        } finally {
            setLoading(false);
        }
    }, [activeOnly]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    return {
        packages,
        loading,
        error,
        refetch: fetchPackages,
    };
};