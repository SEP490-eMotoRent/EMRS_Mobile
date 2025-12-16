import { useCallback, useEffect, useRef, useState } from "react";
import { Branch } from "../../../../domain/entities/operations/Branch";
import { parseDateRange } from "../utils/dateParser";
import { useVehicleSearch } from "./useVehicleSearch";
import { trackBreadcrumb, trackError, setTrackingContext } from "../utils/crashTracker";

export const useMapInteractions = ({ dateRange = "Chọn Ngày" }: { dateRange?: string } = {}) => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    // Refs to track current state (prevents stale closures)
    const selectedBranchIdRef = useRef<string | null>(null);
    const bottomSheetVisibleRef = useRef(false);
    
    // Ref to track last branch press time (for debouncing)
    const lastBranchPressTimeRef = useRef<number>(0);
    
    // Ref to track ongoing search operation
    const ongoingSearchRef = useRef<boolean>(false);

    const { vehicles, loading, error, searchVehicles, cancelSearch } = useVehicleSearch();

    // Set initial tracking context
    useEffect(() => {
        setTrackingContext('MapScreen', 'Idle');
    }, []);

    // Sync refs with state
    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
        
        console.log(`[useMapInteractions] State updated: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
        trackBreadcrumb(`State: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
    }, [selectedBranchId, bottomSheetVisible]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('[useMapInteractions] Unmounting hook');
            trackBreadcrumb('🧹 useMapInteractions unmounting');
            cancelSearch();
        };
    }, [cancelSearch]);

    /**
     * Handle branch marker press with debouncing and race condition prevention
     * 
     * Critical fixes:
     * 1. Debounce rapid clicks (300ms cooldown)
     * 2. Prevent overlapping search operations
     * 3. Check if previous operation is ongoing before starting new one
     */
    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
            try {
                const now = Date.now();
                const timeSinceLastPress = now - lastBranchPressTimeRef.current;
                
                // CRITICAL: Debounce rapid clicks (prevent crash from animation race conditions)
                if (timeSinceLastPress < 300) {
                    console.log('[useMapInteractions] Click debounced (too rapid)');
                    trackBreadcrumb('⏭️ Click debounced');
                    return;
                }
                
                lastBranchPressTimeRef.current = now;

                console.log('[useMapInteractions] Branch marker pressed: ', branch.id);
                trackBreadcrumb(`👆 Branch marker pressed: ${branch.id}`);
                setTrackingContext('MapScreen', 'BranchMarkerPress');

                // Validate branch
                if (!branch?.id) {
                    trackError('STATE_ERROR', new Error('Invalid branch'), 'Branch ID missing', { branch });
                    return;
                }

                const isSame = selectedBranchIdRef.current === branch.id;

                // If clicking same branch and sheet is open, close it
                if (isSame && bottomSheetVisibleRef.current) {
                    console.log('[useMapInteractions] Closing sheet for same branch');
                    trackBreadcrumb('🔽 Closing bottom sheet (same branch)');
                    setTrackingContext('MapScreen', 'ClosingSheet');
                    
                    cancelSearch();
                    ongoingSearchRef.current = false;
                    setBottomSheetVisible(false);
                    setSelectedBranchId(null);
                    selectedBranchIdRef.current = null;
                    return;
                }

                // CRITICAL: Prevent overlapping search operations
                if (ongoingSearchRef.current) {
                    console.log('[useMapInteractions] Search already in progress, cancelling...');
                    trackBreadcrumb('⏳ Cancelling ongoing search');
                    cancelSearch();
                    ongoingSearchRef.current = false;
                    
                    // Small delay to let cancellation complete
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                console.log('[useMapInteractions] Opening new branch: ', branch.id);
                trackBreadcrumb(`🏢 Opening branch: ${branch.id}`);
                setTrackingContext('MapScreen', 'OpeningSheet');

                // Mark search as ongoing
                ongoingSearchRef.current = true;

                // Update state immediately (optimistic UI)
                setSelectedBranchId(branch.id);
                selectedBranchIdRef.current = branch.id;
                setBottomSheetVisible(true);

                // Parse date range
                const parsed = parseDateRange(dateRange);
                
                console.log('[useMapInteractions] Starting search for branch: ', branch.id);
                trackBreadcrumb(`🔍 Starting search for branch ${branch.id}`);
                setTrackingContext('MapScreen', 'SearchingVehicles');
                
                // Perform vehicle search
                await searchVehicles(
                    branch.id, 
                    dateRange, 
                    parsed.startTime, 
                    parsed.endTime
                );

                // Mark search as complete
                ongoingSearchRef.current = false;

                console.log('[useMapInteractions] Search completed for branch: ', branch.id);
                trackBreadcrumb('✅ Search completed successfully');
                setTrackingContext('MapScreen', 'SheetOpen');
                
            } catch (err: any) {
                ongoingSearchRef.current = false;
                console.error('[useMapInteractions] Branch press failed: ', err);
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
     * Handle map press - close bottom sheet
     */
    const handleMapPress = useCallback(() => {
        console.log('[useMapInteractions] Map pressed');
        trackBreadcrumb('🗺️ Map pressed');
        setTrackingContext('MapScreen', 'MapPress');

        cancelSearch();
        ongoingSearchRef.current = false;
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
    }, [cancelSearch]);

    /**
     * Handle bottom sheet close button
     */
    const handleBottomSheetClose = useCallback(() => {
        console.log('[useMapInteractions] Bottom sheet close button pressed');
        trackBreadcrumb('✕ Bottom sheet close button pressed');
        setTrackingContext('MapScreen', 'CloseButtonPress');

        cancelSearch();
        ongoingSearchRef.current = false;
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
    }, [cancelSearch]);

    /**
     * Handle search bar press - open booking modal
     */
    const handleSearchBarPress = useCallback(() => {
        console.log('[useMapInteractions] Search bar pressed');
        trackBreadcrumb('🔍 Search bar pressed');
        setBookingModalVisible(true);
    }, []);

    /**
     * Handle booking modal close
     */
    const handleBookingModalClose = useCallback(() => {
        console.log('[useMapInteractions] Booking modal closed');
        trackBreadcrumb('✕ Booking modal closed');
        setBookingModalVisible(false);
    }, []);

    /**
     * Handle vehicle booking
     */
    const handleBookVehicle = useCallback((vehicleId: string) => {
        console.log('[useMapInteractions] Book vehicle: ', vehicleId);
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