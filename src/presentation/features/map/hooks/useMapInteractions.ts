import { useCallback, useEffect, useRef, useState } from "react";
import { Branch } from "../../../../domain/entities/operations/Branch";
import { parseDateRange } from "../utils/dateParser";
import { useVehicleSearch } from "./useVehicleSearch";

export const useMapInteractions = ({ dateRange = "Chọn Ngày" }: { dateRange?: string } = {}) => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    // Prevent stale closures + rapid taps
    const selectedBranchIdRef = useRef<string | null>(null);
    const bottomSheetVisibleRef = useRef(false);
    const isProcessingRef = useRef(false);

    const { vehicles, loading, error, searchVehicles } = useVehicleSearch();

    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
    }, [selectedBranchId, bottomSheetVisible]);

    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
        if (!branch?.id || isProcessingRef.current) return;

        const isSame = selectedBranchIdRef.current === branch.id;

        if (isSame && bottomSheetVisibleRef.current) {
            setBottomSheetVisible(false);
            setSelectedBranchId(null);
            return;
        }

        isProcessingRef.current = true;
        setSelectedBranchId(branch.id);
        setBottomSheetVisible(true);

        try {
            const parsed = parseDateRange(dateRange);
            // YOUR ACTUAL searchVehicles signature — ONLY 4 ARGS
            await searchVehicles(branch.id, dateRange, parsed.startTime, parsed.endTime);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            isProcessingRef.current = false;
        }
        },
        [dateRange, searchVehicles]
    );

    const handleMapPress = useCallback(() => {
        setSelectedBranchId(null);
        setBottomSheetVisible(false);
    }, []);

    const handleBottomSheetClose = useCallback(() => {
        setSelectedBranchId(null);
        setBottomSheetVisible(false);
    }, []);

    const handleSearchBarPress = useCallback(() => {
        setBookingModalVisible(true);
    }, []);

    const handleBookingModalClose = useCallback(() => {
        setBookingModalVisible(false);
    }, []);

    const handleBookVehicle = useCallback((vehicleId: string) => {
        console.log("Book vehicle:", vehicleId);
    }, []);

    return {
        selectedBranchId,
        bottomSheetVisible,
        selectedVehicles: vehicles || [],
        bookingModalVisible,
        vehiclesLoading: loading,
        vehiclesError: error,
        handleBranchMarkerPress,
        handleMapPress,
        handleBottomSheetClose,
        handleSearchBarPress,
        handleBookingModalClose,
        handleBookVehicle,
    };
};