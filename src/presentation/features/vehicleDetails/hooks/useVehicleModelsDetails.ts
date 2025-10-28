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
                
                // Call both APIs in parallel
                const [detailDto, listResponse] = await Promise.all([
                    remote.getDetail(id),
                    remote.getAll()
                ]);
                
                if (!mounted) return;

                if (!detailDto) {
                    throw new Error("Vehicle not found");
                }

                // Find matching vehicle from list API
                const listItem = listResponse.find(
                    (item) => item.vehicleModelId === id
                );

                // Create base data from detail API
                const baseData = VehicleDetailMapper.toUI(detailDto);

                // Merge with list API data if found
                if (listItem) {
                    const enhancedData: VehicleDetailUI = {
                        ...baseData,
                        imageUrl: listItem.imageUrl || baseData.imageUrl,
                        pricePerDay: listItem.rentalPrice ?? baseData.pricePerDay,
                        colors: (listItem.availableColors || []).map(c => 
                            VehicleDetailMapper.nameToHex(c.colorName)
                        ),
                    };
                    setData(enhancedData);
                } else {
                    // If not found in list, just use detail data
                    setData(baseData);
                }
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
    }, [id]);

    return { data, loading, error };
};