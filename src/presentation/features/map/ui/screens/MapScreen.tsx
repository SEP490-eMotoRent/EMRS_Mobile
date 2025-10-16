import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapSearchBar } from "../molecules/MapSearchBar";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { MapFilters } from "../orgamisms/MapFilters";
import { ClusterMarker } from "../atoms/markers/ClusterMarkers";
import { PriceMarker } from "../atoms/markers/PriceMarkers";

type MapScreenRouteProp = RouteProp<HomeStackParamList, 'Map'>;
type MapScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Map'>;

interface Branch {
    id: number;
    latitude: number;
    longitude: number;
    price: number;
    bikesAvailable: number;
}

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

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
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    // Sample branch data - replace with real data from your API
    const branches: Branch[] = [
        { id: 1, latitude: 10.8231, longitude: 106.6297, price: 79, bikesAvailable: 5 },
        { id: 2, latitude: 10.7769, longitude: 106.7009, price: 85, bikesAvailable: 3 },
        { id: 3, latitude: 10.8502, longitude: 106.7718, price: 95, bikesAvailable: 8 },
        { id: 4, latitude: 10.7626, longitude: 106.6820, price: 72, bikesAvailable: 2 },
        { id: 5, latitude: 10.8047, longitude: 106.6591, price: 88, bikesAvailable: 6 },
    ];

    // Sample cluster data - this would be calculated based on zoom level
    const clusters = [
        { id: 101, latitude: 10.7900, longitude: 106.7200, count: 4, minPrice: 200 },
    ];

    const handleMarkerPress = (id: number) => {
        setSelectedMarkerId(id);
    };

    const handleRefresh = () => {
        // Refresh map data - you can fetch from API here
        console.log("Refreshing map data...");
    };

    const handleListViewPress = () => {
        // Navigate to list view screen
        console.log("Switch to list view");
        // navigation.navigate('ListView'); // Add this screen later
    };

    const handleSearchBarPress = () => {
        setBookingModalVisible(true);
    };

    return (
        <View style={styles.container}>
        {/* Map */}
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={() => setSelectedMarkerId(null)}
        >
            {/* Individual branch markers */}
            {branches.map((branch) => (
            <Marker
                key={branch.id}
                coordinate={{
                latitude: branch.latitude,
                longitude: branch.longitude,
                }}
                onPress={() => handleMarkerPress(branch.id)}
            >
                <PriceMarker
                price={branch.price}
                isSelected={selectedMarkerId === branch.id}
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
            >
                <ClusterMarker count={cluster.count} minPrice={cluster.minPrice} />
            </Marker>
            ))}
        </MapView>

        {/* Search Bar Overlay */}
        <View style={styles.searchBarContainer}>
            <MapSearchBar
            location={location}
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
        <View style={styles.listViewContainer}>
            <ListViewButton onPress={handleListViewPress} />
        </View>

        {/* Booking Modal */}
        <BookingModal
            visible={bookingModalVisible}
            onClose={() => setBookingModalVisible(false)}
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
});