import { useEffect, useState, useRef } from "react";
import { VehicleModelRemoteDataSource } from "../../../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { VehicleDetailMapper, VehicleDetailUI } from "../mappers/VehicleDetailsMapper";

export const useVehicleDetail = (id: string, remote: VehicleModelRemoteDataSource) => {
    const [data, setData] = useState<VehicleDetailUI | null>(null);
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
                
                // Just call the detail API - it now has everything we need
                const detailDto = await remote.getDetail(id);
                
                if (!mounted) return;

                if (!detailDto) {
                    throw new Error("Vehicle not found");
                }

                // Map detail response to UI format
                const uiData = VehicleDetailMapper.toUI(detailDto);
                setData(uiData);
                
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || 'Failed to load vehicle details');
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
    }, [id, remote]);

    return { data, loading, error };
};