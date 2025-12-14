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

    const { vehicles, loading, error, searchVehicles, cancelSearch } = useVehicleSearch();

    useEffect(() => {
        setTrackingContext('MapScreen', 'Idle');
    }, []);

    useEffect(() => {
        selectedBranchIdRef.current = selectedBranchId;
        bottomSheetVisibleRef.current = bottomSheetVisible;
        
        // Add log for state change
        console.log(`[useMapInteractions] State updated: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
        trackBreadcrumb(`State: branchId=${selectedBranchId}, sheet=${bottomSheetVisible}`);
    }, [selectedBranchId, bottomSheetVisible]);

    useEffect(() => {
        return () => {
            console.log('[useMapInteractions] Unmounting hook');
            trackBreadcrumb('🧹 useMapInteractions unmounting');
            cancelSearch();
        };
    }, [cancelSearch]);

    const handleBranchMarkerPress = useCallback(
        async (branch: Branch) => {
            try {
                console.log('[useMapInteractions] Branch marker pressed: ', branch.id);
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
                    
                    cancelSearch();
                    setBottomSheetVisible(false);
                    setSelectedBranchId(null);
                    selectedBranchIdRef.current = null;
                    return;
                }

                console.log('[useMapInteractions] Opening new branch: ', branch.id);
                trackBreadcrumb(`🏢 Opening branch: ${branch.id}`);
                setTrackingContext('MapScreen', 'OpeningSheet');

                cancelSearch();

                setSelectedBranchId(branch.id);
                selectedBranchIdRef.current = branch.id;
                setBottomSheetVisible(true);

                const parsed = parseDateRange(dateRange);
                
                console.log('[useMapInteractions] Starting search for branch: ', branch.id);
                trackBreadcrumb(`🔍 Starting search for branch ${branch.id}`);
                setTrackingContext('MapScreen', 'SearchingVehicles');
                
                await searchVehicles(
                    branch.id, 
                    dateRange, 
                    parsed.startTime, 
                    parsed.endTime
                );

                console.log('[useMapInteractions] Search completed for branch: ', branch.id);
                trackBreadcrumb('✅ Search completed successfully');
                setTrackingContext('MapScreen', 'SheetOpen');
                
            } catch (err: any) {
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

    const handleMapPress = useCallback(() => {
        console.log('[useMapInteractions] Map pressed');
        trackBreadcrumb('🗺️ Map pressed');
        setTrackingContext('MapScreen', 'MapPress');

        cancelSearch();
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
    }, [cancelSearch]);

    const handleBottomSheetClose = useCallback(() => {
        console.log('[useMapInteractions] Bottom sheet close button pressed');
        trackBreadcrumb('✕ Bottom sheet close button pressed');
        setTrackingContext('MapScreen', 'CloseButtonPress');

        cancelSearch();
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
        selectedBranchIdRef.current = null;
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