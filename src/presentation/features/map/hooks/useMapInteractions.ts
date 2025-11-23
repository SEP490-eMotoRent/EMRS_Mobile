import { useState, useCallback, useRef } from 'react';
import { Branch } from '../../../../domain/entities/operations/Branch';
import { parseDateRange } from '../utils/dateParser';
import { useVehicleSearch } from './useVehicleSearch';

interface UseMapInteractionsParams {
    dateRange?: string;
}

export const useMapInteractions = ({ dateRange = "Chọn Ngày" }: UseMapInteractionsParams = {}) => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    
    // ✅ THROTTLE instead of debounce - prevents rapid clicks
    const lastClickTimeRef = useRef<number>(0);
    const lastClickedBranchRef = useRef<string | null>(null);

    const { vehicles, loading, error, searchVehicles } = useVehicleSearch();

    // ✅ ULTRA DEFENSIVE marker press handler with throttling
    const handleBranchMarkerPress = useCallback(async (branch: Branch) => {
        const now = Date.now();
        
        // ✅ THROTTLE: Ignore clicks within 500ms of last click
        if (now - lastClickTimeRef.current < 500) {
            console.log('⏱️ Click throttled - too fast');
            return;
        }
        
        lastClickTimeRef.current = now;

        try {
            // ✅ Validate branch
            if (!branch?.id) {
                console.warn('⚠️ Invalid branch:', branch);
                return;
            }

            // ✅ If same branch, toggle off
            if (lastClickedBranchRef.current === branch.id && bottomSheetVisible) {
                console.log('👆 Toggling off same branch');
                setBottomSheetVisible(false);
                setSelectedBranchId(null);
                lastClickedBranchRef.current = null;
                return;
            }

            console.log('🎯 Branch clicked:', branch.id);
            
            lastClickedBranchRef.current = branch.id;

            // ✅ Update UI FIRST (instant feedback)
            setSelectedBranchId(branch.id);
            setBottomSheetVisible(true);

            // ✅ Parse dates safely
            let startTime: string | undefined;
            let endTime: string | undefined;
            
            try {
                const parsed = parseDateRange(dateRange);
                startTime = parsed.startTime;
                endTime = parsed.endTime;
            } catch (parseError) {
                console.warn('⚠️ Date parse failed:', parseError);
            }

            // ✅ Search in background (async, won't block UI)
            searchVehicles(branch.id, dateRange, startTime, endTime)
                .catch(err => {
                    console.error('❌ Search failed:', err);
                    // Don't crash - just log it
                });
            
        } catch (error) {
            console.error('❌ handleBranchMarkerPress error:', error);
            // ✅ Don't crash app - recover gracefully
        }
    }, [dateRange, searchVehicles, bottomSheetVisible]);

    // ✅ Safe map press handler
    const handleMapPress = useCallback(() => {
        try {
            setSelectedBranchId(null);
            setBottomSheetVisible(false);
            lastClickedBranchRef.current = null;
        } catch (error) {
            console.error('❌ handleMapPress error:', error);
        }
    }, []);

    // ✅ Safe bottom sheet close
    const handleBottomSheetClose = useCallback(() => {
        try {
            setBottomSheetVisible(false);
            setSelectedBranchId(null);
            lastClickedBranchRef.current = null;
        } catch (error) {
            console.error('❌ handleBottomSheetClose error:', error);
        }
    }, []);

    // ✅ Safe search bar press
    const handleSearchBarPress = useCallback(() => {
        try {
            setBookingModalVisible(true);
        } catch (error) {
            console.error('❌ handleSearchBarPress error:', error);
        }
    }, []);

    // ✅ Safe booking modal close
    const handleBookingModalClose = useCallback(() => {
        try {
            setBookingModalVisible(false);
        } catch (error) {
            console.error('❌ handleBookingModalClose error:', error);
        }
    }, []);

    // ✅ Safe book vehicle handler
    const handleBookVehicle = useCallback((vehicleId: string) => {
        try {
            console.log("📱 Booking vehicle:", vehicleId);
        } catch (error) {
            console.error('❌ handleBookVehicle error:', error);
        }
    }, []);

    return {
        selectedBranchId,
        bottomSheetVisible,
        selectedVehicles: vehicles,
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