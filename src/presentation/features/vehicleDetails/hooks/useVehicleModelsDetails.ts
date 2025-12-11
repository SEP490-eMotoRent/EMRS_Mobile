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
            const raw = await repository.getDetailRaw(id); // ✅ CHANGED: use getDetailRaw instead of getDetail

            if (!mounted || !raw) return;

            console.log('🔍 RAW API RESPONSE:', JSON.stringify(raw, null, 2));

            const uiData = VehicleDetailMapper.toUI({
                ...raw,
                images: raw.images?.length > 0 
                    ? raw.images 
                    : [`https://via.placeholder.com/800x500/1a1a1a/ffffff?text=${encodeURIComponent(raw.modelName)}`],
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