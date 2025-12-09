import { useEffect, useState } from 'react';
import { InsurancePackage } from '../../../../domain/entities/insurance/InsurancePackage';
import { container } from '../../../../core/di/ServiceContainer';

export interface UseInsurancePackageByIdResult {
    package: InsurancePackage | null;
    loading: boolean;
    error: string | null;
}

export const useInsurancePackageById = (id: string | null): UseInsurancePackageByIdResult => {
    const [packageData, setPackageData] = useState<InsurancePackage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setPackageData(null);
            setLoading(false);
            return;
        }

        const fetchPackage = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await container.insurance.packages.getById.execute(id);
                setPackageData(result);
            } catch (err: any) {
                console.error(`Error fetching insurance package ${id}:`, err);
                setError(err.message || 'Failed to load insurance package');
                setPackageData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    return {
        package: packageData,
        loading,
        error,
    };
};