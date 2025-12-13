import { useCallback, useEffect, useRef, useState } from "react";
import { Branch } from "../../../../domain/entities/operations/Branch";
import { parseDateRange } from "../utils/dateParser";
import { useVehicleSearch } from "./useVehicleSearch";
import { trackBreadcrumb, trackError, setTrackingContext } from "../utils/crashTracker";

export const useMapInteractions = ({ dateRange = "Chọn Ngày" }: { dateRange?: string } = {}) => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    // Prevent stale closures + rapid taps
    const selectedBranchIdRef = useRef<string | null>(null);
    const bottomSheetVisibleRef = useRef(false);
    const isProcessingRef = useRef(false);
    const animationLockRef = useRef(false);

    const { vehicles, loading, error, searchVehicles, cancelSearch } = useVehicleSearch();

    // ✅ Set tracking context
    useEffect(() => {
        setTrackingContext('MapScreen', 'Idle');
    }, []);

    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
        
        // ✅ Track state changes
        trackBreadcrumb(`State: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
    }, [selectedBranchId, bottomSheetVisible]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            trackBreadcrumb('🧹 useMapInteractions unmounting');
            cancelSearch();
        };
    }, [cancelSearch]);

    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
            try {
                trackBreadcrumb(`👆 Branch marker pressed: ${branch.id}`);
                setTrackingContext('MapScreen', 'BranchMarkerPress');

                // ✅ Prevent spam clicks during animation or processing
                if (animationLockRef.current || isProcessingRef.current) {
                    trackBreadcrumb('🚫 Click ignored - operation in progress');
                    return;
                }

                if (!branch?.id) {
                    trackError('STATE_ERROR', new Error('Invalid branch'), 'Branch ID missing', { branch });
                    return;
                }

                const isSame = selectedBranchIdRef.current === branch.id;

                // Tapping same branch = close
                if (isSame && bottomSheetVisibleRef.current) {
                    trackBreadcrumb('🔽 Closing bottom sheet (same branch)');
                    setTrackingContext('MapScreen', 'ClosingSheet');
                    
                    cancelSearch();
                    
                    animationLockRef.current = true;
                    setBottomSheetVisible(false);
                    setSelectedBranchId(null);
                    
                    setTimeout(() => {
                        animationLockRef.current = false;
                        setTrackingContext('MapScreen', 'Idle');
                    }, 300);
                    return;
                }

                // ✅ Lock to prevent concurrent operations
                animationLockRef.current = true;
                isProcessingRef.current = true;

                trackBreadcrumb(`🏢 Opening branch: ${branch.id}`);
                setTrackingContext('MapScreen', 'OpeningSheet');

                // ✅ Cancel previous search immediately
                cancelSearch();

                // Update UI immediately
                setSelectedBranchId(branch.id);
                setBottomSheetVisible(true);

                // Small delay to ensure state updates and animation starts
                await new Promise(resolve => setTimeout(resolve, 100));

                // Parse date range
                const parsed = parseDateRange(dateRange);
                
                trackBreadcrumb(`🔍 Starting search for branch ${branch.id}`);
                setTrackingContext('MapScreen', 'SearchingVehicles');
                
                // Start vehicle search
                await searchVehicles(
                    branch.id, 
                    dateRange, 
                    parsed.startTime, 
                    parsed.endTime
                );

                trackBreadcrumb('✅ Search completed successfully');
                setTrackingContext('MapScreen', 'SheetOpen');
                
            } catch (err: any) {
                trackError('JS_ERROR', err, 'Branch marker press failed', {
                    branchId: branch?.id,
                    dateRange,
                    selectedBranchId: selectedBranchIdRef.current,
                    bottomSheetVisible: bottomSheetVisibleRef.current,
                });
            } finally {
                // ✅ Wait for open animation to complete
                setTimeout(() => {
                    animationLockRef.current = false;
                    isProcessingRef.current = false;
                }, 400);
            }
        },
        [dateRange, searchVehicles, cancelSearch]
    );

    const handleMapPress = useCallback(() => {
        try {
            trackBreadcrumb('🗺️ Map pressed');
            setTrackingContext('MapScreen', 'MapPress');

            // Don't allow closing during animation
            if (animationLockRef.current) {
                trackBreadcrumb('🚫 Map press ignored - animation in progress');
                return;
            }

            cancelSearch();

            animationLockRef.current = true;
            setSelectedBranchId(null);
            setBottomSheetVisible(false);

            setTimeout(() => {
                animationLockRef.current = false;
                setTrackingContext('MapScreen', 'Idle');
            }, 300);
        } catch (err) {
            trackError('JS_ERROR', err, 'Map press handler failed');
        }
    }, [cancelSearch]);

    const handleBottomSheetClose = useCallback(() => {
        try {
            trackBreadcrumb('✕ Bottom sheet close button pressed');
            setTrackingContext('MapScreen', 'CloseButtonPress');

            // Don't allow closing during animation
            if (animationLockRef.current) {
                trackBreadcrumb('🚫 Close ignored - animation in progress');
                return;
            }

            cancelSearch();

            animationLockRef.current = true;
            setSelectedBranchId(null);
            setBottomSheetVisible(false);

            setTimeout(() => {
                animationLockRef.current = false;
                setTrackingContext('MapScreen', 'Idle');
            }, 300);
        } catch (err) {
            trackError('JS_ERROR', err, 'Bottom sheet close failed');
        }
    }, [cancelSearch]);

    const handleSearchBarPress = useCallback(() => {
        trackBreadcrumb('🔍 Search bar pressed');
        setBookingModalVisible(true);
    }, []);

    const handleBookingModalClose = useCallback(() => {
        trackBreadcrumb('✕ Booking modal closed');
        setBookingModalVisible(false);
    }, []);

    const handleBookVehicle = useCallback((vehicleId: string) => {
        trackBreadcrumb(`📖 Book vehicle: ${vehicleId}`);
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