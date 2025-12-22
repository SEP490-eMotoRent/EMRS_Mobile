import { useCallback, useEffect, useRef, useState } from "react";
import { Branch } from "../../../../domain/entities/operations/Branch";
import { parseDateRange } from "../utils/dateParser";
import { useVehicleSearch } from "./useVehicleSearch";
import { trackBreadcrumb, trackError, setTrackingContext } from "../utils/crashTracker";

export const useMapInteractions = ({ dateRange = "Chọn Ngày" }: { dateRange?: string } = {}) => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    const selectedBranchIdRef = useRef<string | null>(null);
    const bottomSheetVisibleRef = useRef(false);
    const lastBranchPressTimeRef = useRef<number>(0);
    const ongoingSearchRef = useRef<boolean>(false);

    const { vehicles, loading, error, searchVehicles, cancelSearch } = useVehicleSearch();

    useEffect(() => {
        setTrackingContext('MapScreen', 'Idle');
    }, []);

    /**
     * FIXED: Commented out console.log
     */
    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
        
        // console.log(`[useMapInteractions] State updated: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
        trackBreadcrumb(`State: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
    }, [selectedBranchId, bottomSheetVisible]);

    /**
     * FIXED: Commented out console.log
     */
    useEffect(() => {
        return () => {
            // console.log('[useMapInteractions] Unmounting hook');
            trackBreadcrumb('🧹 useMapInteractions unmounting');
            cancelSearch();
        };
    }, [cancelSearch]);

    /**
     * FIXED: Commented out all console.logs
     */
    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
            try {
                const now = Date.now();
                const timeSinceLastPress = now - lastBranchPressTimeRef.current;
                
                if (timeSinceLastPress < 300) {
                    // console.log('[useMapInteractions] Click debounced (too rapid)');
                    trackBreadcrumb('⏭️ Click debounced');
                    return;
                }
                
                lastBranchPressTimeRef.current = now;

                // console.log('[useMapInteractions] Branch marker pressed: ', branch.id);
                trackBreadcrumb(`👆 Branch marker pressed: ${branch.id}`);
                setTrackingContext('MapScreen', 'BranchMarkerPress');

                if (!branch?.id) {
                    trackError('STATE_ERROR', new Error('Invalid branch'), 'Branch ID missing', { branch });
                    return;
                }

                const isSame = selectedBranchIdRef.current === branch.id;

                if (isSame && bottomSheetVisibleRef.current) {
                    // console.log('[useMapInteractions] Closing sheet for same branch');
                    trackBreadcrumb('🔽 Closing bottom sheet (same branch)');
                    setTrackingContext('MapScreen', 'ClosingSheet');
                    
                    cancelSearch();
                    ongoingSearchRef.current = false;
                    setBottomSheetVisible(false);
                    setSelectedBranchId(null);
                    selectedBranchIdRef.current = null;
                    return;
                }

                if (ongoingSearchRef.current) {
                    // console.log('[useMapInteractions] Search already in progress, cancelling...');
                    trackBreadcrumb('⏳ Cancelling ongoing search');
                    cancelSearch();
                    ongoingSearchRef.current = false;
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // console.log('[useMapInteractions] Opening new branch: ', branch.id);
                trackBreadcrumb(`🏢 Opening branch: ${branch.id}`);
                setTrackingContext('MapScreen', 'OpeningSheet');

                ongoingSearchRef.current = true;

                setSelectedBranchId(branch.id);
                selectedBranchIdRef.current = branch.id;
                setBottomSheetVisible(true);

                const parsed = parseDateRange(dateRange);
                
                // console.log('[useMapInteractions] Starting search for branch: ', branch.id);
                trackBreadcrumb(`🔍 Starting search for branch ${branch.id}`);
                setTrackingContext('MapScreen', 'SearchingVehicles');
                
                await searchVehicles(
                    branch.id, 
                    dateRange, 
                    parsed.startTime, 
                    parsed.endTime
                );

                ongoingSearchRef.current = false;

                // console.log('[useMapInteractions] Search completed for branch: ', branch.id);
                trackBreadcrumb('✅ Search completed successfully');
                setTrackingContext('MapScreen', 'SheetOpen');
                
            } catch (err: any) {
                ongoingSearchRef.current = false;
                // console.error('[useMapInteractions] Branch press failed: ', err);
                trackError('JS_ERROR', err, 'Branch marker press failed', {
                    branchId: branch?.id,
                    dateRange,
                    selectedBranchId: selectedBranchIdRef.current,
                    bottomSheetVisible: bottomSheetVisibleRef.current,
                });
            }
        },
        [dateRange, searchVehicles, cancelSearch]
    );

    /**
     * FIXED: Commented out console.log
     */
    const handleMapPress = useCallback(() => {
        // console.log('[useMapInteractions] Map pressed');
        trackBreadcrumb('🗺️ Map pressed');
        setTrackingContext('MapScreen', 'MapPress');

        cancelSearch();
        ongoingSearchRef.current = false;
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
    }, [cancelSearch]);

    /**
     * FIXED: Commented out console.log
     */
    const handleBottomSheetClose = useCallback(() => {
        // console.log('[useMapInteractions] Bottom sheet close button pressed');
        trackBreadcrumb('✕ Bottom sheet close button pressed');
        setTrackingContext('MapScreen', 'CloseButtonPress');

        cancelSearch();
        ongoingSearchRef.current = false;
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
    }, [cancelSearch]);

    /**
     * FIXED: Commented out console.log
     */
    const handleSearchBarPress = useCallback(() => {
        // console.log('[useMapInteractions] Search bar pressed');
        trackBreadcrumb('🔍 Search bar pressed');
        setBookingModalVisible(true);
    }, []);

    /**
     * FIXED: Commented out console.log
     */
    const handleBookingModalClose = useCallback(() => {
        // console.log('[useMapInteractions] Booking modal closed');
        trackBreadcrumb('✕ Booking modal closed');
        setBookingModalVisible(false);
    }, []);

    /**
     * FIXED: Commented out console.log
     */
    const handleBookVehicle = useCallback((vehicleId: string) => {
        // console.log('[useMapInteractions] Book vehicle: ', vehicleId);
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