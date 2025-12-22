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
    
    // ✅ NEW: Track if animation is in progress
    const animationInProgressRef = useRef<boolean>(false);

    const { vehicles, loading, error, searchVehicles, cancelSearch } = useVehicleSearch();

    useEffect(() => {
        setTrackingContext('MapScreen', 'Idle');
    }, []);

    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
        
        trackBreadcrumb(`State: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
    }, [selectedBranchId, bottomSheetVisible]);

    useEffect(() => {
        return () => {
            trackBreadcrumb('🧹 useMapInteractions unmounting');
            cancelSearch();
        };
    }, [cancelSearch]);

    /**
     * ✅ FIXED: Increased debounce to 500ms and added animation check
     * - Prevents rapid marker presses during animations
     * - Gives map time to settle between interactions
     */
    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
            try {
                const now = Date.now();
                const timeSinceLastPress = now - lastBranchPressTimeRef.current;
                
                // ✅ INCREASED: 300ms -> 500ms for better stability
                if (timeSinceLastPress < 500) {
                    console.log('[useMapInteractions] Click debounced (too rapid)');
                    trackBreadcrumb('⏭️ Click debounced');
                    return;
                }
                
                // ✅ NEW: Block interactions during animations
                if (animationInProgressRef.current) {
                    console.log('[useMapInteractions] Click blocked (animation in progress)');
                    trackBreadcrumb('🚫 Click blocked - animation in progress');
                    return;
                }
                
                lastBranchPressTimeRef.current = now;

                console.log('[useMapInteractions] Branch marker pressed:', branch.id);
                trackBreadcrumb(`👆 Branch marker pressed: ${branch.id}`);
                setTrackingContext('MapScreen', 'BranchMarkerPress');

                if (!branch?.id) {
                    trackError('STATE_ERROR', new Error('Invalid branch'), 'Branch ID missing', { branch });
                    return;
                }

                const isSame = selectedBranchIdRef.current === branch.id;

                if (isSame && bottomSheetVisibleRef.current) {
                    console.log('[useMapInteractions] Closing sheet for same branch');
                    trackBreadcrumb('🔽 Closing bottom sheet (same branch)');
                    setTrackingContext('MapScreen', 'ClosingSheet');
                    
                    // ✅ NEW: Mark animation in progress
                    animationInProgressRef.current = true;
                    
                    cancelSearch();
                    ongoingSearchRef.current = false;
                    setBottomSheetVisible(false);
                    setSelectedBranchId(null);
                    selectedBranchIdRef.current = null;
                    
                    // ✅ NEW: Wait for animation to complete before allowing new interactions
                    setTimeout(() => {
                        animationInProgressRef.current = false;
                        console.log('[useMapInteractions] Animation complete - ready for new interactions');
                    }, 300); // Match animation duration
                    
                    return;
                }

                if (ongoingSearchRef.current) {
                    console.log('[useMapInteractions] Search already in progress, cancelling...');
                    trackBreadcrumb('⏳ Cancelling ongoing search');
                    cancelSearch();
                    ongoingSearchRef.current = false;
                    
                    // ✅ INCREASED: 100ms -> 150ms to ensure cleanup completes
                    await new Promise(resolve => setTimeout(resolve, 150));
                }

                console.log('[useMapInteractions] Opening new branch:', branch.id);
                trackBreadcrumb(`🏢 Opening branch: ${branch.id}`);
                setTrackingContext('MapScreen', 'OpeningSheet');

                // ✅ NEW: Mark animation in progress
                animationInProgressRef.current = true;
                ongoingSearchRef.current = true;

                setSelectedBranchId(branch.id);
                selectedBranchIdRef.current = branch.id;
                setBottomSheetVisible(true);

                // ✅ NEW: Wait for bottom sheet animation to start before searching
                await new Promise(resolve => setTimeout(resolve, 100));

                const parsed = parseDateRange(dateRange);
                
                console.log('[useMapInteractions] Starting search for branch:', branch.id);
                trackBreadcrumb(`🔍 Starting search for branch ${branch.id}`);
                setTrackingContext('MapScreen', 'SearchingVehicles');
                
                await searchVehicles(
                    branch.id, 
                    dateRange, 
                    parsed.startTime, 
                    parsed.endTime
                );

                ongoingSearchRef.current = false;
                
                // ✅ NEW: Mark animation complete
                setTimeout(() => {
                    animationInProgressRef.current = false;
                    console.log('[useMapInteractions] Animation complete - ready for new interactions');
                }, 400); // Slightly longer to ensure everything settles

                console.log('[useMapInteractions] Search completed for branch:', branch.id);
                trackBreadcrumb('✅ Search completed successfully');
                setTrackingContext('MapScreen', 'SheetOpen');
                
            } catch (err: any) {
                ongoingSearchRef.current = false;
                animationInProgressRef.current = false; // ✅ Reset on error
                
                console.error('[useMapInteractions] Branch press failed:', err);
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
     * ✅ FIXED: Check animation state before handling
     */
    const handleMapPress = useCallback(() => {
        // Allow map press even during animation to cancel bottom sheet
        console.log('[useMapInteractions] Map pressed');
        trackBreadcrumb('🗺️ Map pressed');
        setTrackingContext('MapScreen', 'MapPress');

        animationInProgressRef.current = true; // ✅ Mark animation start
        cancelSearch();
        ongoingSearchRef.current = false;
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
        
        // ✅ Reset animation flag after animation completes
        setTimeout(() => {
            animationInProgressRef.current = false;
        }, 300);
    }, [cancelSearch]);

    /**
     * ✅ FIXED: Handle animation flag on close
     */
    const handleBottomSheetClose = useCallback(() => {
        console.log('[useMapInteractions] Bottom sheet close button pressed');
        trackBreadcrumb('✕ Bottom sheet close button pressed');
        setTrackingContext('MapScreen', 'CloseButtonPress');

        animationInProgressRef.current = true; // ✅ Mark animation start
        cancelSearch();
        ongoingSearchRef.current = false;
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
        
        // ✅ Reset animation flag after animation completes
        setTimeout(() => {
            animationInProgressRef.current = false;
        }, 300);
    }, [cancelSearch]);

    const handleSearchBarPress = useCallback(() => {
        console.log('[useMapInteractions] Search bar pressed');
        trackBreadcrumb('🔍 Search bar pressed');
        setBookingModalVisible(true);
    }, []);

    const handleBookingModalClose = useCallback(() => {
        console.log('[useMapInteractions] Booking modal closed');
        trackBreadcrumb('✕ Booking modal closed');
        setBookingModalVisible(false);
    }, []);

    const handleBookVehicle = useCallback((vehicleId: string) => {
        console.log('[useMapInteractions] Book vehicle:', vehicleId);
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