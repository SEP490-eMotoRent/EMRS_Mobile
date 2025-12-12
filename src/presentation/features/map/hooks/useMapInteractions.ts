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
    const animationLockRef = useRef(false);
    const currentSearchRef = useRef<AbortController | null>(null);

    const { vehicles, loading, error, searchVehicles } = useVehicleSearch();

    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
    }, [selectedBranchId, bottomSheetVisible]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (currentSearchRef.current) {
                currentSearchRef.current.abort();
            }
        };
    }, []);

    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
            // ✅ Prevent spam clicks during animation or processing
            if (animationLockRef.current || isProcessingRef.current) {
                console.log('🚫 Ignoring click - animation in progress');
                return;
            }

            if (!branch?.id) return;

            // ✅ Cancel any in-flight search
            if (currentSearchRef.current) {
                console.log('⏹️ Aborting previous search');
                currentSearchRef.current.abort();
            }

            const isSame = selectedBranchIdRef.current === branch.id;

            // Tapping same branch = close
            if (isSame && bottomSheetVisibleRef.current) {
                console.log('🔽 Closing bottom sheet');
                animationLockRef.current = true;
                
                setBottomSheetVisible(false);
                setSelectedBranchId(null);
                
                // Release lock after close animation completes
                setTimeout(() => {
                    animationLockRef.current = false;
                }, 300);
                return;
            }

            // ✅ Lock to prevent concurrent operations
            animationLockRef.current = true;
            isProcessingRef.current = true;

            console.log(`🔍 Opening branch: ${branch.id}`);

            try {
                // Create abort controller for this specific search
                const controller = new AbortController();
                currentSearchRef.current = controller;

                // Update UI immediately
                setSelectedBranchId(branch.id);
                setBottomSheetVisible(true);

                // Parse date range
                const parsed = parseDateRange(dateRange);
                
                // Start vehicle search
                await searchVehicles(
                    branch.id, 
                    dateRange, 
                    parsed.startTime, 
                    parsed.endTime
                );

                // Only release locks if this search wasn't cancelled
                if (!controller.signal.aborted) {
                    console.log('✅ Search completed successfully');
                    // Wait for open animation to complete before allowing new clicks
                    setTimeout(() => {
                        animationLockRef.current = false;
                        isProcessingRef.current = false;
                    }, 350); // Slightly longer than animation duration
                } else {
                    console.log('⏹️ Search was cancelled');
                    isProcessingRef.current = false;
                }
            } catch (err: any) {
                // Ignore abort errors (they're expected)
                if (err?.name !== 'AbortError') {
                    console.error("❌ Search failed:", err);
                }
                
                // Release locks on error
                animationLockRef.current = false;
                isProcessingRef.current = false;
            }
        },
        [dateRange, searchVehicles]
    );

    const handleMapPress = useCallback(() => {
        // Don't allow closing during animation
        if (animationLockRef.current) {
            return;
        }

        if (currentSearchRef.current) {
            currentSearchRef.current.abort();
        }

        console.log('🗺️ Map pressed - closing bottom sheet');
        animationLockRef.current = true;
        
        setSelectedBranchId(null);
        setBottomSheetVisible(false);

        setTimeout(() => {
            animationLockRef.current = false;
        }, 300);
    }, []);

    const handleBottomSheetClose = useCallback(() => {
        // Don't allow closing during animation
        if (animationLockRef.current) {
            return;
        }

        if (currentSearchRef.current) {
            currentSearchRef.current.abort();
        }

        console.log('✕ Bottom sheet close button pressed');
        animationLockRef.current = true;
        
        setSelectedBranchId(null);
        setBottomSheetVisible(false);

        setTimeout(() => {
            animationLockRef.current = false;
        }, 300);
    }, []);

    const handleSearchBarPress = useCallback(() => {
        setBookingModalVisible(true);
    }, []);

    const handleBookingModalClose = useCallback(() => {
        setBookingModalVisible(false);
    }, []);

    const handleBookVehicle = useCallback((vehicleId: string) => {
        console.log("📖 Book vehicle:", vehicleId);
        // Add your booking logic here
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