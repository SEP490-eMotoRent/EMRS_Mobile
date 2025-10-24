// presentation/features/vehicleDetails/hooks/useVehicleDetail.ts
import { useEffect, useState, useRef } from "react";
import { VehicleModelRemoteDataSource } from "../../../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { VehicleDetailMapper } from "../mappers/VehicleDetailsMapper";

export const useVehicleDetail = (id: string, remote: VehicleModelRemoteDataSource) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {
        let mounted = true;
        abortController.current = new AbortController();

        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const dto = await remote.getDetail(id);
                
                if (mounted && dto) {
                    setData(VehicleDetailMapper.toUI(dto));
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || 'Failed to load');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetch();

        return () => {
            mounted = false;
            abortController.current?.abort();
        };
    }, [id]); // ✅ Removed 'remote' dependency - it shouldn't change

    return { data, loading, error };
};