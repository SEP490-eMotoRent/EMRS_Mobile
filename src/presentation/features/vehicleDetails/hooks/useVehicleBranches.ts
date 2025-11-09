import { useEffect, useState, useRef } from "react";
import { GetBranchesByVehicleModelUseCase } from "../../../../domain/usecases/branch/GetBranchesByVehicleModelUseCase";
import { Branch } from "../../../../domain/entities/operations/Branch";

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

export const useVehicleBranches = (
    vehicleModelId: string,
    useCase: GetBranchesByVehicleModelUseCase
) => {
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

                const branchEntities = await useCase.execute(vehicleModelId);

                if (!mounted) return;

                // Map Branch entities to UI-friendly format
                const uiBranches: BranchUI[] = branchEntities.map((branch) => ({
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
                    vehicleCount: 0, // This would come from the API if available
                }));

                setBranches(uiBranches);
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || "Failed to load branches");
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
    }, [vehicleModelId, useCase]);

    return { branches, loading, error };
};