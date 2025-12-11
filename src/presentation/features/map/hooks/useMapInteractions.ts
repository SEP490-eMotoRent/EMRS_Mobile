import { useCallback, useRef, useState } from 'react';
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
    
    const lastClickTimeRef = useRef<number>(0);
    const lastClickedBranchRef = useRef<string | null>(null);
    const isOpeningRef = useRef(false);

    const { vehicles, loading, error, searchVehicles } = useVehicleSearch();

    const handleBranchMarkerPress = useCallback(async (branch: Branch) => {
        const now = Date.now();
        
        if (now - lastClickTimeRef.current < 800) {
            console.log('⏱️ Click throttled - too fast');
            return;
        }

        if (isOpeningRef.current) {
            console.log('🚫 Already opening - blocked');
            return;
        }
        
        lastClickTimeRef.current = now;

        try {
            if (!branch?.id) {
                console.warn('⚠️ Invalid branch');
                return;
            }

            if (lastClickedBranchRef.current === branch.id && bottomSheetVisible) {
                console.log('👆 Closing same branch');
                setBottomSheetVisible(false);
                setSelectedBranchId(null);
                lastClickedBranchRef.current = null;
                return;
            }

            console.log('🎯 Opening branch:', branch.id);
            
            isOpeningRef.current = true;
            lastClickedBranchRef.current = branch.id;

            if (bottomSheetVisible && selectedBranchId !== branch.id) {
                console.log('🔄 Switching branches - full close');
                setBottomSheetVisible(false);
                setSelectedBranchId(null);
                
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            setSelectedBranchId(branch.id);
            setBottomSheetVisible(true);

            let startTime: string | undefined;
            let endTime: string | undefined;
            
            try {
                const parsed = parseDateRange(dateRange);
                startTime = parsed.startTime;
                endTime = parsed.endTime;
            } catch (parseError) {
                console.warn('⚠️ Date parse failed:', parseError);
            }

            searchVehicles(branch.id, dateRange, startTime, endTime)
                .catch(err => {
                    console.error('❌ Search failed:', err);
                })
                .finally(() => {
                    isOpeningRef.current = false;
                });
            
        } catch (error) {
            console.error('❌ handleBranchMarkerPress error:', error);
            isOpeningRef.current = false;
        }
    }, [dateRange, searchVehicles, bottomSheetVisible, selectedBranchId]);

    const handleMapPress = useCallback(() => {
        try {
            setSelectedBranchId(null);
            setBottomSheetVisible(false);
            lastClickedBranchRef.current = null;
            isOpeningRef.current = false;
        } catch (error) {
            console.error('❌ handleMapPress error:', error);
        }
    }, []);

    const handleBottomSheetClose = useCallback(() => {
        try {
            setBottomSheetVisible(false);
            setSelectedBranchId(null);
            lastClickedBranchRef.current = null;
            isOpeningRef.current = false;
        } catch (error) {
            console.error('❌ handleBottomSheetClose error:', error);
        }
    }, []);

    const handleSearchBarPress = useCallback(() => {
        try {
            setBookingModalVisible(true);
        } catch (error) {
            console.error('❌ handleSearchBarPress error:', error);
        }
    }, []);

    const handleBookingModalClose = useCallback(() => {
        try {
            setBookingModalVisible(false);
        } catch (error) {
            console.error('❌ handleBookingModalClose error:', error);
        }
    }, []);

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