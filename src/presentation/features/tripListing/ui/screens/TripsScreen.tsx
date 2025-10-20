import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { FilterTags } from "../molecules/FilterTags";
import { SearchBar } from "../molecules/SearchBar";
import { TabButton } from "../molecules/TabButton";
import { CurrentTrip, CurrentTripCard } from "../orgamisms/CurrentTripCard ";
import { PastTrip, PastTripCard } from "../orgamisms/PastTripCard";
import { TripsHeader } from "../orgamisms/TripsHeader";

type TabType = "current" | "past";
type PastFilterType = "completed" | "cancelled" | null;

// Mock data
const mockCurrentTrips: CurrentTrip[] = [
    {
        id: "1",
        vehicleName: "VinFast Evo200",
        dates: "Sep 01 - Sep 07, 2025",
        status: "renting",
        timeInfo: "5 days 12 hours left",
        reference: "#EMR240915001",
        location: "VINFAST DONG SAI GON - CN",
    },
    {
        id: "2",
        vehicleName: "VinFast Klara",
        dates: "Sep 24 - Sep 26, 2025",
        status: "confirmed",
        timeInfo: "Starts in 3 days",
        reference: "#EMR240920002",
        totalAmount: "1,750,000đ",
    },
    {
        id: "3",
        vehicleName: "Pega NewTech",
        dates: "Sep 15 - Sep 18, 2025",
        status: "returned",
        reference: "#EMR240918003",
    },
];

const mockPastTrips: PastTrip[] = [
    {
        id: "4",
        vehicleName: "VinFast Evo200",
        dates: "Aug 20 - Aug 25, 2025",
        status: "completed",
        rating: 5,
        totalAmount: "1,450,000đ",
    },
    {
        id: "5",
        vehicleName: "Klara S",
        dates: "Aug 05 - Aug 07, 2025",
        status: "completed",
        rating: 4,
        totalAmount: "950,000đ",
    },
    {
        id: "6",
        vehicleName: "VinFast Evo200",
        dates: "Jun 20 - Jun 22, 2025",
        status: "cancelled",
        refundedAmount: "850,000đ",
    },
];

export const TripsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<TabType>("current");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Recent first");
    
    const [pastFilter, setPastFilter] = useState<PastFilterType>(null);

    const handleNotification = () => {
        console.log("Open notifications");
    };

    const handleSortPress = () => {
        console.log("Open sort options");
        // TODO: Show sort options modal
    };

    // Filter current trips
    const filteredCurrentTrips = mockCurrentTrips.filter(trip => {
        if (searchQuery) {
            return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trip.reference.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    // Filter past trips
    const filteredPastTrips = mockPastTrips.filter(trip => {
        if (pastFilter && trip.status !== pastFilter) return false;
        if (searchQuery) {
            return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    // Past trips filter tags
    const pastFilterTags = [
        { id: "completed", label: "Completed", count: mockPastTrips.filter(t => t.status === "completed").length },
        { id: "cancelled", label: "Cancelled", count: mockPastTrips.filter(t => t.status === "cancelled").length },
    ];
    const renderCurrentTrips = () => (
        <FlatList
            data={filteredCurrentTrips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <CurrentTripCard
                    trip={item}
                    onViewDetails={() => console.log("View details", item.id)}
                    onExtendRental={item.status === "renting" ? () => console.log("Extend rental", item.id) : undefined}
                    onReportIssue={item.status === "renting" ? () => console.log("Report issue", item.id) : undefined}
                    onCancel={item.status === "confirmed" ? () => console.log("Cancel", item.id) : undefined}
                />
            )}
            contentContainerStyle={styles.listContentCurrent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No current trips</Text>
            }
        />
    );

    const renderPastTrips = () => (
        <FlatList
            data={filteredPastTrips}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
            <View style={{ marginTop: index === 0 ? 0 : 4 }}>
                <PastTripCard
                trip={item}
                onRentAgain={() => console.log("Rent again", item.id)}
                onViewReceipt={() => console.log("View receipt", item.id)}
                onBookSimilar={
                    item.status === "cancelled"
                    ? () => console.log("Book similar", item.id)
                    : undefined
                }
                />
            </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
            <Text style={styles.emptyText}>No past trips</Text>
            }
        />
        );


    return (
        <View style={styles.container}>
            {/* Header */}
            <TripsHeader
                onNotification={handleNotification}
                notificationCount={3}
            />

            {/* Search Bar */}
            <SearchBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                sortValue={sortBy}
                onSortPress={handleSortPress}
            />

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TabButton
                    label="Current Trips"
                    isActive={activeTab === "current"}
                    onPress={() => setActiveTab("current")}
                />
                <TabButton
                    label="Past Trips"
                    isActive={activeTab === "past"}
                    onPress={() => setActiveTab("past")}
                />
            </View>

            {/* Filter Tags - Only for Past Trips */}
            {activeTab === "past" && (
                <View style={{ marginTop: 8, marginBottom: 8 }}>
                    <FilterTags
                    tags={pastFilterTags}
                    activeTagId={pastFilter}
                    onTagPress={(id) => setPastFilter(id as PastFilterType)}
                    />
                </View>
            )}


            {/* Content - Wrapped in View */}
            <View style={styles.contentContainer}>
                {activeTab === "current" ? renderCurrentTrips() : renderPastTrips()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    contentContainer: {
        flex: 1,
        paddingTop: 0,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 20,
    },
    listContentCurrent: {
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 20,
    },
    emptyText: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
        marginTop: 12,
    },
});
