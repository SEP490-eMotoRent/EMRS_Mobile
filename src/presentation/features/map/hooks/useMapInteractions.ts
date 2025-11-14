import { useState } from 'react';
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

    const { vehicles, loading, error, searchVehicles } = useVehicleSearch();

    const handleBranchMarkerPress = async (branch: Branch) => {
        try {
            // ✅ Validate branch data
            if (!branch || !branch.id) {
                console.warn('Invalid branch data:', branch);
                return;
            }

            // ✅ Set UI state first (immediate feedback)
            setSelectedBranchId(branch.id);
            setBottomSheetVisible(true);

            // ✅ Parse date range safely with try-catch
            let startTime: string | undefined;
            let endTime: string | undefined;
            
            try {
                const parsed = parseDateRange(dateRange);
                startTime = parsed.startTime;
                endTime = parsed.endTime;
            } catch (parseError) {
                console.error('Date parsing error:', parseError);
                // Continue without dates rather than crashing
            }

            // ✅ Search for vehicles with error handling
            await searchVehicles(branch.id, dateRange, startTime, endTime);
            
        } catch (error) {
            // ✅ Catch ANY error and log it instead of crashing
            console.error('Error in handleBranchMarkerPress:', error);
            
            // ✅ Keep bottom sheet open but show empty state
            // User will see "No vehicles available" instead of crash
        }
    };

    const handleMapPress = () => {
        try {
            setSelectedBranchId(null);
            setBottomSheetVisible(false);
        } catch (error) {
            console.error('Error in handleMapPress:', error);
        }
    };

    const handleBottomSheetClose = () => {
        try {
            setBottomSheetVisible(false);
            setSelectedBranchId(null);
        } catch (error) {
            console.error('Error in handleBottomSheetClose:', error);
        }
    };

    const handleSearchBarPress = () => {
        try {
            setBookingModalVisible(true);
        } catch (error) {
            console.error('Error in handleSearchBarPress:', error);
        }
    };

    const handleBookingModalClose = () => {
        try {
            setBookingModalVisible(false);
        } catch (error) {
            console.error('Error in handleBookingModalClose:', error);
        }
    };

    const handleBookVehicle = (vehicleId: string) => {
        try {
            console.log("Booking vehicle model:", vehicleId);
            // Add your booking logic here
        } catch (error) {
            console.error('Error in handleBookVehicle:', error);
        }
    };

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