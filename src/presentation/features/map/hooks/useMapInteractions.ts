import { useState } from 'react';
import { Branch } from '../../../../domain/entities/operations/Branch';
import { ElectricVehicle } from '../ui/molecules/VehicleCard';

export const useMapInteractions = () => {
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedVehicles, setSelectedVehicles] = useState<ElectricVehicle[]>([]);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    const handleBranchMarkerPress = (branch: Branch) => {
        setSelectedBranchId(branch.id);
        
        // TODO: When Vehicle API is ready, do this:
        // 1. Get branch.vehicles (40 physical vehicles)
        // 2. Group by vehicleModelId
        // 3. Map to ElectricVehicle[] for display (showing models, not individual bikes)
        
        // MOCK DATA - Representing 3 different VehicleModels at this branch
        const mockVehicles: ElectricVehicle[] = [
            {
                id: 1,
                name: "VinFast Evo200",
                brand: "VinFast",
                type: "Electric Scooter",
                range: "100 Km",
                battery: "3.5 kWh",
                seats: 2,
                color: "Yellow",
                colorHex: "#FFD700",
                price: 10,
                features: ["Eco Mode", "Sport Mode", "USB Charging"]
            },
            {
                id: 2,
                name: "Yadea G5",
                brand: "Yadea",
                type: "Electric Scooter",
                range: "80 Km",
                battery: "2.8 kWh",
                seats: 2,
                color: "Black",
                colorHex: "#1a1a1a",
                price: 8,
                features: ["Smart Lock", "LED Display"]
            },
            {
                id: 3,
                name: "Pega NewTech",
                brand: "Pega",
                type: "Electric Scooter",
                range: "120 Km",
                battery: "4.2 kWh",
                seats: 2,
                color: "Red",
                colorHex: "#FF4444",
                price: 12,
                features: ["Fast Charging", "Cruise Control"]
            },
        ];
        
        setSelectedVehicles(mockVehicles);
        setBottomSheetVisible(true);
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

    const handleBookVehicle = (vehicleId: number) => {
        console.log("Booking vehicle:", vehicleId);
        // TODO: Navigate to booking screen
    };

    return {
        selectedBranchId,
        bottomSheetVisible,
        selectedVehicles,
        bookingModalVisible,
        handleBranchMarkerPress,
        handleMapPress,
        handleBottomSheetClose,
        handleSearchBarPress,
        handleBookingModalClose,
        handleBookVehicle,
    };
};