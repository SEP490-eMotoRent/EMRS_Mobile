import { useState } from 'react';
import { Branch } from '../../../../domain/entities/operations/Branch';
import { parseDateRange } from '../utils/dateParser';
import { useVehicleSearch } from './useVehicleSearch';

interface UseMapInteractionsParams {
    dateRange?: string; // Make optional
}

export const useMapInteractions = ({ dateRange = "Chọn Ngày" }: UseMapInteractionsParams = {}) => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    const { vehicles, loading, error, searchVehicles } = useVehicleSearch();

    const handleBranchMarkerPress = async (branch: Branch) => {
        setSelectedBranchId(branch.id);
        setBottomSheetVisible(true);

        // Parse date range to ISO 8601
        const { startTime, endTime } = parseDateRange(dateRange);

        // Search for vehicle models at this branch (pass dateRange for duration calculation)
        await searchVehicles(branch.id, dateRange, startTime, endTime);
    };

    const handleMapPress = () => {
        setSelectedBranchId(null);
        setBottomSheetVisible(false);
    };

    const handleBottomSheetClose = () => {
        setBottomSheetVisible(false);
        setSelectedBranchId(null);
    };

    const handleSearchBarPress = () => {
        setBookingModalVisible(true);
    };

    const handleBookingModalClose = () => {
        setBookingModalVisible(false);
    };

    const handleBookVehicle = (vehicleId: string) => {
        console.log("Booking vehicle model:", vehicleId);
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