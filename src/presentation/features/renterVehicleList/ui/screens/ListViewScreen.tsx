// import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import React, { useState } from "react";
// import { FlatList, StyleSheet, View } from "react-native";
// import { Motorcycle, MotorcycleCard } from "../orgamism/MotorcycleCard";
// import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
// import { ListHeader } from "../orgamism/ListHeader";
// import { ListControls } from "../orgamism/ListControls";
// import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
// import { MapViewButton } from "../atoms/buttons/MapViewButtons";


// type ListViewRouteProp = RouteProp<BrowseStackParamList, 'ListView'>;
// type ListViewNavigationProp = StackNavigationProp<BrowseStackParamList, 'ListView'>;

// // Mock data
// const motorcycles: Motorcycle[] = [
//     {
//         id: 1,
//         name: "Evo200",
//         brand: "VinFast",
//         variant: "Standard Range",
//         image: "https://via.placeholder.com/800x450/FFD700/000000?text=VinFast",
//         price: 10,
//         distance: 2.3,
//         range: "100 Km",
//         battery: "11 Liters",
//         seats: 2,
//         features: ["Eco Mode", "Sport Mode", "USB Charging"],
//         deliveryAvailable: true,
//         branchName: "District 1 Branch",
//         color: "#FFD700",
//     },
//     {
//         id: 2,
//         name: "G5",
//         brand: "Yadea",
//         variant: "City Commuter",
//         image: "https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Yadea",
//         price: 8,
//         distance: 3.1,
//         range: "80 Km",
//         battery: "9 Liters",
//         seats: 2,
//         features: ["Smart Lock", "LED Display", "Anti-theft"],
//         deliveryAvailable: true,
//         branchName: "Tan Binh Branch",
//         color: "#1a1a1a",
//     },
//     {
//         id: 3,
//         name: "NewTech",
//         brand: "Pega",
//         variant: "Long Range Pro",
//         image: "https://via.placeholder.com/800x450/FF4444/ffffff?text=Pega",
//         price: 12,
//         distance: 4.5,
//         range: "120 Km",
//         battery: "13 Liters",
//         seats: 2,
//         features: ["Fast Charging", "Cruise Control", "App Control"],
//         deliveryAvailable: false,
//         branchName: "District 3 Branch",
//         color: "#FF4444",
//     },
//     {
//         id: 4,
//         name: "Bike S",
//         brand: "DK",
//         variant: "Lightweight Edition",
//         image: "https://via.placeholder.com/800x450/ffffff/000000?text=DK",
//         price: 9,
//         distance: 3.8,
//         range: "90 Km",
//         battery: "10 Liters",
//         seats: 2,
//         features: ["Lightweight", "Foldable", "Quick Charge"],
//         deliveryAvailable: true,
//         branchName: "Binh Thanh Branch",
//         color: "#ffffff",
//     },
//     {
//         id: 5,
//         name: "R133",
//         brand: "Bluera",
//         variant: "Smart Connect",
//         image: "https://via.placeholder.com/800x450/4169E1/ffffff?text=Bluera",
//         price: 11,
//         distance: 2.9,
//         range: "95 Km",
//         battery: "10.5 Liters",
//         seats: 2,
//         features: ["Bluetooth", "GPS Tracking", "Keyless Start"],
//         deliveryAvailable: true,
//         branchName: "District 7 Branch",
//         color: "#4169E1",
//     },
// ];

// type SortType = "closest" | "price-low" | "price-high";

// export const ListView: React.FC = () => {
//     const route = useRoute<ListViewRouteProp>();
//     const navigation = useNavigation<ListViewNavigationProp>();

//     const [sortBy, setSortBy] = useState<SortType>("closest");
//     const [bookingModalVisible, setBookingModalVisible] = useState(false);

//     const { location, dateRange, address } = route.params || {
//         location: "Ho Chi Minh City, Vietnam",
//         dateRange: "Oct 20 | 10:00 AM - Oct 23 | 10:00 AM",
//         address: "Ho Chi Minh City, Vietnam",
//     };

//     const sortedMotorcycles = [...motorcycles].sort((a, b) => {
//         if (sortBy === "closest") return a.distance - b.distance;
//         if (sortBy === "price-low") return a.price - b.price;
//         if (sortBy === "price-high") return b.price - a.price;
//         return 0;
//     });

//     const handleSortPress = () => {
//         if (sortBy === "closest") setSortBy("price-low");
//         else if (sortBy === "price-low") setSortBy("price-high");
//         else setSortBy("closest");
//     };

//     const getSortLabel = () => {
//         if (sortBy === "closest") return "Closest To Address";
//         if (sortBy === "price-low") return "Price: Low to High";
//         return "Price: High to Low";
//     };

//     const handleMapViewPress = () => {
//         navigation.navigate("Map", { location, dateRange, address });
//     };

//     const handleSearchPress = () => {
//         setBookingModalVisible(true);
//     };

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={sortedMotorcycles}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => <MotorcycleCard motorcycle={item} />}
//                 ListHeaderComponent={
//                     <>
//                         <ListHeader
//                             location={address}
//                             dateRange={dateRange}
//                             onSearchPress={handleSearchPress}
//                             onPricePress={() => console.log("Price filter")}
//                             onModelPress={() => console.log("Model filter")}
//                             onRangePress={() => console.log("Range filter")}
//                         />
//                         <ListControls
//                             totalResults={motorcycles.length}
//                             sortLabel={getSortLabel()}
//                             onSortPress={handleSortPress}
//                         />
//                     </>
//                 }
//                 contentContainerStyle={styles.listContent}
//                 stickyHeaderIndices={[0]}
//             />

//             {/* Map View Button */}
//             <View style={styles.mapButtonContainer}>
//                 <MapViewButton onPress={handleMapViewPress} />
//             </View>

//             {/* Booking Modal */}
//             <BookingModal
//                 visible={bookingModalVisible}
//                 onClose={() => setBookingModalVisible(false)}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#000",
//     },
//     listContent: {
//         paddingHorizontal: 16,
//         paddingTop: 16,
//         paddingBottom: 100,
//     },
//     mapButtonContainer: {
//         position: "absolute",
//         bottom: 25,
//         alignSelf: "center",
//     },
// });

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Motorcycle, MotorcycleCard } from "../orgamism/MotorcycleCard";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ListHeader } from "../orgamism/ListHeader";
import { ListControls } from "../orgamism/ListControls";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { MapViewButton } from "../atoms/buttons/MapViewButtons";
import { useVehicles } from "../../hooks/useVehicles";
import { VehicleMapper } from "../../mappers/VehicleMapper";
import { EmptyState } from "../molecules/state/EmptyState";
import { ErrorState } from "../molecules/state/ErrorState";
import { LoadingState } from "../molecules/state/LoadingState";


type ListViewRouteProp = RouteProp<BrowseStackParamList, 'ListView'>;
type ListViewNavigationProp = StackNavigationProp<BrowseStackParamList, 'ListView'>;

type SortType = "closest" | "price-low" | "price-high";

export const ListView: React.FC = () => {
    const route = useRoute<ListViewRouteProp>();
    const navigation = useNavigation<ListViewNavigationProp>();

    const { vehicles, loading, error, refetch } = useVehicles();

    const [sortBy, setSortBy] = useState<SortType>("closest");
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    const { location, dateRange, address } = route.params || {
        location: "Ho Chi Minh City, Vietnam",
        dateRange: "Oct 20 | 10:00 AM - Oct 23 | 10:00 AM",
        address: "Ho Chi Minh City, Vietnam",
    };

    const motorcycles = useMemo(() => {
        return VehicleMapper.toMotorcycles(vehicles);
    }, [vehicles]);

    const sortedMotorcycles = useMemo(() => {
        const sorted = [...motorcycles].sort((a, b) => {
            if (sortBy === "closest") return a.distance - b.distance;
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0;
        });
        return sorted;
    }, [motorcycles, sortBy]);

    const handleSortPress = () => {
        if (sortBy === "closest") setSortBy("price-low");
        else if (sortBy === "price-low") setSortBy("price-high");
        else setSortBy("closest");
    };

    const getSortLabel = () => {
        if (sortBy === "closest") return "Closest To Address";
        if (sortBy === "price-low") return "Price: Low to High";
        return "Price: High to Low";
    };

    const handleMapViewPress = () => {
        navigation.navigate("Map", { location, dateRange, address });
    };

    const handleSearchPress = () => {
        setBookingModalVisible(true);
    };

    const renderEmptyComponent = () => {
        if (loading) {
            return <LoadingState />;
        }

        if (error) {
            return (
                <ErrorState 
                    message={error}
                    onRetry={refetch}
                />
            );
        }

        return (
            <EmptyState 
                onAction={refetch}
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedMotorcycles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MotorcycleCard motorcycle={item} />}
                ListHeaderComponent={
                    <>
                        <ListHeader
                            location={address}
                            dateRange={dateRange}
                            onSearchPress={handleSearchPress}
                            onPricePress={() => console.log("Price filter")}
                            onModelPress={() => console.log("Model filter")}
                            onRangePress={() => console.log("Range filter")}
                        />
                        <ListControls
                            totalResults={motorcycles.length}
                            sortLabel={getSortLabel()}
                            onSortPress={handleSortPress}
                        />
                    </>
                }
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={sortedMotorcycles.length === 0 ? styles.emptyListContent : styles.listContent}
                stickyHeaderIndices={[0]}
                refreshing={loading}
                onRefresh={refetch}
            />

            <View style={styles.mapButtonContainer}>
                <MapViewButton onPress={handleMapViewPress} />
            </View>

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
        backgroundColor: "#000",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
    },
    emptyListContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
        flexGrow: 1,
    },
    mapButtonContainer: {
        position: "absolute",
        bottom: 25,
        alignSelf: "center",
    },
});