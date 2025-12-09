import { useEffect, useRef, useState } from "react";
import { container } from "../../../../core/di/ServiceContainer";
import { VehicleDetailMapper, VehicleDetailUI } from "../mappers/VehicleDetailsMapper";

export const useVehicleDetail = (id: string) => {
    const [data, setData] = useState<VehicleDetailUI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!id) {
        setError("ID xe không hợp lệ");
        setLoading(false);
        return;
        }

        let mounted = true;
        abortController.current = new AbortController();

        const fetchDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const repository = container.vehicle.modelRepository;
            const raw = await repository.getDetail(id); // returns VehicleModel (old type)

            if (!mounted) return;

            // Safe cast — we know the real shape from API
            const detailDto = raw as any as {
            id: string;
            modelName: string;
            category: string;
            batteryCapacityKwh: number;
            maxRangeKm: number;
            maxSpeedKmh: number;
            description: string;
            depositAmount: number;
            rentalPricing: { rentalPrice: number; id?: string };
            images: string[];
            };

            const uiData = VehicleDetailMapper.toUI({
            ...detailDto,
            // Ensure images is always an array with at least one image
            images: detailDto.images?.length > 0
                ? detailDto.images
                : [`https://via.placeholder.com/800x500/1a1a1a/ffffff?text=${encodeURIComponent(detailDto.modelName)}`],
            });

            setData(uiData);
        } catch (err: any) {
            if (mounted) {
            setError(err.message || "Không thể tải thông tin xe");
            console.error("[useVehicleDetail]", err);
            }
        } finally {
            if (mounted) setLoading(false);
        }
        };

        fetchDetail();

        return () => {
        mounted = false;
        abortController.current?.abort();
        };
    }, [id]);

    return { data, loading, error };
};