import { useEffect, useState, useRef } from "react";
import { container } from "../../../../core/di/ServiceContainer";

export interface BranchUI {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    openingTime: string;
    closingTime: string;
    vehicleCount?: number;
}

export const useVehicleBranches = (vehicleModelId: string) => {
    const [branches, setBranches] = useState<BranchUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {
        let mounted = true;
        abortController.current = new AbortController();

        const fetchBranches = async () => {
            try {
                setLoading(true);
                setError(null);

                const useCase = container.branch.get.byVehicleModel;
                const branchEntities = await useCase.execute(vehicleModelId);

                if (!mounted) return;

                console.log('🔍 [useVehicleBranches] Raw branch entities from API:', JSON.stringify(branchEntities, null, 2));

                // Map Branch entities to UI-friendly format
                const uiBranches: BranchUI[] = branchEntities.map((branch: any) => {
                    console.log(`🔍 [useVehicleBranches] Processing branch: ${branch.branchName}, vehicleCount: ${branch.vehicleCount}`);
                    
                    return {
                        id: branch.id,
                        name: branch.branchName,
                        address: branch.address,
                        city: branch.city,
                        phone: branch.phone,
                        email: branch.email,
                        latitude: branch.latitude,
                        longitude: branch.longitude,
                        openingTime: branch.openingTime,
                        closingTime: branch.closingTime,
                        vehicleCount: branch.vehicleCount ?? 0,
                    };
                });

                console.log('🏢 [useVehicleBranches] Loaded branches:', JSON.stringify(uiBranches, null, 2));

                setBranches(uiBranches);
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || "Failed to load branches");
                    console.error('❌ [useVehicleBranches] Error:', err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (vehicleModelId) {
            fetchBranches();
        }

        return () => {
            mounted = false;
            abortController.current?.abort();
        };
    }, [vehicleModelId]);

    return { branches, loading, error };
};