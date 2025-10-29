import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapSearchBar } from "../molecules/MapSearchBar";

import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { BranchMarker } from "../atoms/markers/BranchMarker";
import { LocationPinMarker } from "../atoms/markers/LocationPinMarker";
import { ElectricVehicle } from "../molecules/VehicleCard";
import { MapFilters } from "../orgamisms/MapFilters";
import { VehicleBottomSheet } from "../orgamisms/VehicleBottomSheet";

type MapScreenRouteProp = RouteProp<BrowseStackParamList, 'Map'>;
type MapScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Map'>;

interface Branch {
    id: number;
    latitude: number;
    longitude: number;
    price: number;
    bikesAvailable: number;
    vehicles: number[]; // Array of vehicle IDs available at this branch
}

interface Cluster {
    id: number;
    latitude: number;
    longitude: number;
    count: number;
    minPrice: number;
    vehicles: number[]; // Array of vehicle IDs in this cluster
}

// Mock electric vehicle data - replace with your API data
const electricVehicles: ElectricVehicle[] = [
    {
        id: 1,
        name: "VinFast Evo200",
        brand: "VinFast",
        type: "Electric Scooter",
        range: "100 Km",
        battery: "11 Liters",
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
        battery: "9 Liters",
        seats: 2,
        color: "Black",
        colorHex: "#1a1a1a",
        price: 8,
        features: ["Smart Lock", "LED Display", "Anti-theft"]
    },
    {
        id: 3,
        name: "Pega NewTech",
        brand: "Pega",
        type: "Electric Scooter",
        range: "120 Km",
        battery: "13 Liters",
        seats: 2,
        color: "Red",
        colorHex: "#FF4444",
        price: 12,
        features: ["Fast Charging", "Cruise Control", "App Control"]
    },
    {
        id: 4,
        name: "DK Bike S",
        brand: "DK",
        type: "Electric Scooter",
        range: "90 Km",
        battery: "10 Liters",
        seats: 2,
        color: "White",
        colorHex: "#ffffff",
        price: 9,
        features: ["Lightweight", "Foldable", "Quick Charge"]
    },
    {
        id: 5,
        name: "Bluera R133",
        brand: "Bluera",
        type: "Electric Scooter",
        range: "95 Km",
        battery: "10.5 Liters",
        seats: 2,
        color: "Blue",
        colorHex: "#4169E1",
        price: 11,
        features: ["Bluetooth", "GPS Tracking", "Keyless Start"]
    },
];

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
    const [selectedMarkerType, setSelectedMarkerType] = useState<"branch" | "cluster" | null>(null);
    const [searchedLocation, setSearchedLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedVehicles, setSelectedVehicles] = useState<ElectricVehicle[]>([]);

    // Get parameters from navigation
    const { location, dateRange, address } = route.params || {
        location: "1 Phạm Văn Hai, Street, Tân Bình...",
        dateRange: "Select dates",
        address: "1 Phạm Văn Hai, Street, Tân Bình..."
    };

    // Default region (you can change this based on user's location or selected city)
    const [region, setRegion] = useState({
        latitude: 10.8231, // Ho Chi Minh City
        longitude: 106.6297,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // When address changes, geocode it and zoom to that location
    useEffect(() => {
        if (address) {
            geocodeAddress(address);
        }
    }, [address]);

    const geocodeAddress = async (addr: string) => {
        // TODO: Replace with actual geocoding API call
        const mockCoordinates = {
            latitude: 10.7991,
            longitude: 106.6650,
        };

        setSearchedLocation(mockCoordinates);
        
        setRegion({
            latitude: mockCoordinates.latitude,
            longitude: mockCoordinates.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        });
    };

    // Sample branch data with vehicle IDs
    const branches: Branch[] = [
        { id: 1, latitude: 10.8231, longitude: 106.6297, price: 79, bikesAvailable: 5, vehicles: [1, 2] },
        { id: 2, latitude: 10.7769, longitude: 106.7009, price: 85, bikesAvailable: 3, vehicles: [3] },
        { id: 3, latitude: 10.8502, longitude: 106.7718, price: 95, bikesAvailable: 8, vehicles: [4, 5] },
        { id: 4, latitude: 10.7626, longitude: 106.6820, price: 72, bikesAvailable: 2, vehicles: [2, 4] },
        { id: 5, latitude: 10.8047, longitude: 106.6591, price: 88, bikesAvailable: 6, vehicles: [1, 3, 5] },
    ];

    // Sample cluster data with vehicle IDs
    const clusters: Cluster[] = [
        { id: 101, latitude: 10.7900, longitude: 106.7200, count: 4, minPrice: 200, vehicles: [1, 2, 3, 4] },
    ];

    const handleBranchMarkerPress = (branch: Branch) => {
        setSelectedMarkerId(branch.id);
        setSelectedMarkerType("branch");
        
        // Get vehicles for this branch
        const vehicles = branch.vehicles
            .map(vId => electricVehicles.find(v => v.id === vId))
            .filter((v): v is ElectricVehicle => v !== undefined);
        
        setSelectedVehicles(vehicles);
        setBottomSheetVisible(true);
    };

    const handleClusterMarkerPress = (cluster: Cluster) => {
        setSelectedMarkerId(cluster.id);
        setSelectedMarkerType("cluster");
        
        // Get vehicles for this cluster
        const vehicles = cluster.vehicles
            .map(vId => electricVehicles.find(v => v.id === vId))
            .filter((v): v is ElectricVehicle => v !== undefined);
        
        setSelectedVehicles(vehicles);
        setBottomSheetVisible(true);
    };

    const handleMapPress = () => {
        setSelectedMarkerId(null);
        setSelectedMarkerType(null);
        setBottomSheetVisible(false);
    };

    const handleBottomSheetClose = () => {
        setBottomSheetVisible(false);
        setSelectedMarkerId(null);
        setSelectedMarkerType(null);
    };

    const handleRefresh = () => {
        console.log("Refreshing map data...");
        // Refresh map data - fetch from API here
    };

    const handleListViewPress = () => {
        console.log("Switch to list view");
        navigation.navigate('ListView', { location, dateRange, address });
    };

    const handleSearchBarPress = () => {
        setBookingModalVisible(true);
    };

    const handleBookVehicle = (vehicleId: number) => {
        console.log("Booking vehicle:", vehicleId);
        // Navigate to booking screen or show booking confirmation
        // navigation.navigate('Booking', { vehicleId });
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
            >
                {/* SEARCHED LOCATION PIN/FLAG */}
                {searchedLocation && (
                    <Marker
                        coordinate={searchedLocation}
                        anchor={{ x: 0.5, y: 0.92 }}
                    >
                        <LocationPinMarker />
                    </Marker>
                )}
                {/* Individual branch markers */}
                {branches.map((branch) => (
                    <Marker
                        key={branch.id}
                        coordinate={{
                            latitude: branch.latitude,
                            longitude: branch.longitude,
                        }}
                        onPress={() => handleBranchMarkerPress(branch)}
                        anchor={{ x: 0.5, y: 0.75 }}
                    >
                        <BranchMarker
                            isSelected={selectedMarkerId === branch.id && selectedMarkerType === "branch"}
                        />
                    </Marker>
                ))}

                {/* Cluster markers */}
                {clusters.map((cluster) => (
                    <Marker
                        key={cluster.id}
                        coordinate={{
                            latitude: cluster.latitude,
                            longitude: cluster.longitude,
                        }}
                        onPress={() => handleClusterMarkerPress(cluster)}
                        anchor={{ x: 0.5, y: 0.75 }}
                    >
                        <BranchMarker
                            isSelected={selectedMarkerId === cluster.id && selectedMarkerType === "cluster"}
                        />
                    </Marker>
                ))}
            </MapView>

            {/* Search Bar Overlay */}
            <View style={styles.searchBarContainer}>
                <MapSearchBar
                    location={address}
                    dateRange={dateRange}
                    onPress={handleSearchBarPress}
                />
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <MapFilters
                    onPricePress={() => console.log("Price filter")}
                    onModelPress={() => console.log("Model filter")}
                    onAutopilotPress={() => console.log("Range filter")}
                    onRefreshPress={handleRefresh}
                />
            </View>

            {/* List View Button */}
            <View style={[
                styles.listViewContainer,
                bottomSheetVisible && styles.listViewContainerRaised
            ]}>
                <ListViewButton onPress={handleListViewPress} />
            </View>

            {/* Booking Modal */}
            <BookingModal
                visible={bookingModalVisible}
                onClose={() => setBookingModalVisible(false)}
            />

            {/* Vehicle Bottom Sheet */}
            <VehicleBottomSheet
                visible={bottomSheetVisible}
                vehicles={selectedVehicles}
                markerType={selectedMarkerType === "cluster" ? "cluster" : "price"}
                onClose={handleBottomSheetClose}
                onBookVehicle={handleBookVehicle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    searchBarContainer: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
    },
    filtersContainer: {
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
    },
    listViewContainer: {
        position: "absolute",
        bottom: 100,
        alignSelf: "center",
    },
    listViewContainerRaised: {
        bottom: 360, // 280 (bottom sheet height) + 80 (margin above sheet)
    },
});