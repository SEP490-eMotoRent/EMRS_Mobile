import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import sl from "../../../../../core/di/InjectionContainer";
import { Booking } from "../../../../../domain/entities/booking/Booking";
import { GetCurrentRenterBookingsUseCase } from "../../../../../domain/usecases/booking/GetCurrentRenterBookingsUseCase";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { useGetCurrentRenterBookings } from "../../hooks/useGetCurrentRenterBookings";
import { FilterTags } from "../molecules/FilterTags";
import { SearchBar } from "../molecules/SearchBar";
import { TabButton } from "../molecules/TabButton";
import { CurrentTrip, CurrentTripCard } from "../orgamisms/CurrentTripCard ";
import { PastTrip, PastTripCard } from "../orgamisms/PastTripCard";
import { TripsHeader } from "../orgamisms/TripsHeader";

type TripsScreenNavigationProp = StackNavigationProp<TripStackParamList, 'Trip'>;

type TabType = "current" | "past";
type PastFilterType = "completed" | "cancelled" | null;

export const TripsScreen: React.FC = () => {
    const navigation = useNavigation<TripsScreenNavigationProp>();
    const [activeTab, setActiveTab] = useState<TabType>("current");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Recent first");
    const [pastFilter, setPastFilter] = useState<PastFilterType>(null);

    const getCurrentRenterBookingsUseCase = useMemo(
        () => sl.get<GetCurrentRenterBookingsUseCase>("GetCurrentRenterBookingsUseCase"),
        []
    );
    
    const { bookings, loading, error, refetch } = useGetCurrentRenterBookings(getCurrentRenterBookingsUseCase);

    // ✅ Enhanced mapping with more details from API
    const mapBookingToCurrentTrip = (booking: Booking): CurrentTrip | null => {
        console.log("🔍 Mapping booking:", booking.id, "Status:", booking.bookingStatus);
        
        let status: "renting" | "confirmed" | "returned";
        const bookingStatus = booking.bookingStatus?.toUpperCase();
        
        if (bookingStatus === "ACTIVE" || bookingStatus === "RENTING") {
            status = "renting";
        } else if (bookingStatus === "CONFIRMED" || bookingStatus === "BOOKED") {
            status = "confirmed";
        } else if (bookingStatus === "COMPLETED" || bookingStatus === "RETURNED") {
            status = "returned";
        } else if (bookingStatus === "CANCELLED") {
            return null;
        } else {
            status = "confirmed";
        }

        const formatDate = (date: Date) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
        };

        const startDate = booking.startDatetime ? formatDate(booking.startDatetime) : "";
        const endDate = booking.endDatetime ? formatDate(booking.endDatetime) : "";

        // ✅ Get vehicle details from nested vehicleModel
        const vehicleName = booking.vehicleModel?.modelName || "Unknown Vehicle";
        const vehicleCategory = booking.vehicleModel?.category || "";
        
        // ✅ Calculate rental duration
        const calculateDuration = () => {
            if (booking.rentalDays && booking.rentalDays > 0) {
                return `${booking.rentalDays} day${booking.rentalDays > 1 ? 's' : ''}`;
            }
            if (booking.rentalHours && booking.rentalHours > 0) {
                return `${booking.rentalHours} hour${booking.rentalHours > 1 ? 's' : ''}`;
            }
            return "";
        };

        // ✅ Calculate time remaining or time until start
        const calculateTimeInfo = () => {
            if (!booking.startDatetime) return undefined;
            
            const now = new Date();
            const start = new Date(booking.startDatetime);
            const end = booking.endDatetime ? new Date(booking.endDatetime) : null;
            
            if (status === "renting" && end) {
                const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                if (daysLeft > 0) {
                    return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
                }
                return "Ending soon";
            }
            
            if (status === "confirmed") {
                const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                if (daysUntil > 0) {
                    return `Starts in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
                }
                return `Starts ${startDate}`;
            }
            
            return undefined;
        };

        return {
            id: booking.id,
            vehicleName,
            vehicleCategory,
            dates: `${startDate} - ${endDate}, ${booking.startDatetime?.getFullYear() || ""}`,
            duration: calculateDuration(),
            status,
            timeInfo: calculateTimeInfo(),
            reference: `#${booking.id.substring(0, 8)}`,
            location: "Branch",
            totalAmount: booking.totalAmount ? `${booking.totalAmount.toLocaleString()}đ` : undefined,
            depositAmount: booking.depositAmount ? `${booking.depositAmount.toLocaleString()}đ` : undefined,
            baseRentalFee: booking.baseRentalFee ? `${booking.baseRentalFee.toLocaleString()}đ` : undefined,
            hasInsurance: !!booking.insurancePackage,
            vehicleAssigned: !!booking.vehicleId,
        };
    };

    const mapBookingToPastTrip = (booking: Booking): PastTrip | null => {
        const bookingStatus = booking.bookingStatus?.toUpperCase();
        
        if (bookingStatus !== "COMPLETED" && bookingStatus !== "CANCELLED") {
            return null;
        }

        const formatDate = (date: Date) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
        };

        const startDate = booking.startDatetime ? formatDate(booking.startDatetime) : "";
        const endDate = booking.endDatetime ? formatDate(booking.endDatetime) : "";

        const vehicleName = booking.vehicleModel?.modelName || "Unknown Vehicle";
        const vehicleCategory = booking.vehicleModel?.category || "";

        // ✅ Calculate rental duration for past trips
        const calculateDuration = () => {
            if (booking.rentalDays && booking.rentalDays > 0) {
                return `${booking.rentalDays} day${booking.rentalDays > 1 ? 's' : ''}`;
            }
            if (booking.rentalHours && booking.rentalHours > 0) {
                return `${booking.rentalHours} hour${booking.rentalHours > 1 ? 's' : ''}`;
            }
            return "";
        };

        return {
            id: booking.id,
            vehicleName,
            vehicleCategory,
            dates: `${startDate} - ${endDate}, ${booking.startDatetime?.getFullYear() || ""}`,
            duration: calculateDuration(),
            status: bookingStatus === "COMPLETED" ? "completed" : "cancelled",
            rating: bookingStatus === "COMPLETED" ? 5 : undefined,
            totalAmount: booking.totalAmount ? `${booking.totalAmount.toLocaleString()}đ` : undefined,
            refundedAmount: bookingStatus === "CANCELLED" && booking.depositAmount 
                ? `${booking.depositAmount.toLocaleString()}đ` 
                : undefined,
            hadInsurance: !!booking.insurancePackage,
            lateReturnFee: booking.lateReturnFee && booking.lateReturnFee > 0 
                ? `${booking.lateReturnFee.toLocaleString()}đ` 
                : undefined,
        };
    };

    const currentTrips = useMemo(() => {
        const trips = bookings
            .map(mapBookingToCurrentTrip)
            .filter((trip): trip is CurrentTrip => trip !== null);
        console.log("📊 Current trips count:", trips.length);
        return trips;
    }, [bookings]);

    const pastTrips = useMemo(() => {
        const trips = bookings
            .map(mapBookingToPastTrip)
            .filter((trip): trip is PastTrip => trip !== null);
        console.log("📊 Past trips count:", trips.length);
        return trips;
    }, [bookings]);

    const handleNotification = () => {
        console.log("Open notifications");
    };

    const handleSortPress = () => {
        console.log("Open sort options");
    };

    const handleViewDetails = (bookingId: string) => {
        navigation.navigate('BookingDetails', {
            bookingId,
        });
    };

    const handleExtendRental = (tripId: string) => {
        console.log("Extend rental", tripId);
    };

    const handleReportIssue = (bookingId: string, trip: CurrentTrip) => {
        navigation.navigate('EmergencyContact', {
            bookingId,
            rentalDetails: {
            bikeModel: trip.vehicleName,
            licensePlate: 'ABC-123', // TODO: get from API later
            branch: trip.location || 'Main Branch',
            },
        });
    };

    const handleCancelBooking = (tripId: string) => {
        console.log("Cancel booking", tripId);
    };

    const handleRentAgain = (tripId: string) => {
        console.log("Rent again", tripId);
    };

    const handleViewReceipt = (tripId: string) => {
        console.log("View receipt", tripId);
    };

    const handleBookSimilar = (tripId: string) => {
        console.log("Book similar", tripId);
    };

    const filteredCurrentTrips = currentTrips.filter(trip => {
        if (searchQuery) {
            return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trip.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trip.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const filteredPastTrips = pastTrips.filter(trip => {
        if (pastFilter && trip.status !== pastFilter) return false;
        if (searchQuery) {
            return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trip.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const pastFilterTags = [
        { id: "completed", label: "Completed", count: pastTrips.filter(t => t.status === "completed").length },
        { id: "cancelled", label: "Cancelled", count: pastTrips.filter(t => t.status === "cancelled").length },
    ];

    const renderCurrentTrips = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00ff00" />
                    <Text style={styles.loadingText}>Loading trips...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredCurrentTrips}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CurrentTripCard
                        trip={item}
                        onViewDetails={() => handleViewDetails(item.id)}
                        onExtendRental={item.status === "renting" ? () => handleExtendRental(item.id) : undefined}
                        onReportIssue={item.status === "renting" ? () => handleReportIssue(item.id, item) : undefined}
                        onCancel={item.status === "confirmed" ? () => handleCancelBooking(item.id) : undefined}
                    />
                )}
                contentContainerStyle={styles.listContentCurrent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No current trips</Text>
                }
            />
        );
    };

    const renderPastTrips = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00ff00" />
                    <Text style={styles.loadingText}>Loading trips...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredPastTrips}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={{ marginTop: index === 0 ? 0 : 4 }}>
                        <PastTripCard
                            trip={item}
                            onViewDetails={() => handleViewDetails(item.id)}
                            onRentAgain={() => handleRentAgain(item.id)}
                            onViewReceipt={() => handleViewReceipt(item.id)}
                            onBookSimilar={
                                item.status === "cancelled"
                                    ? () => handleBookSimilar(item.id)
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
    };

    return (
        <View style={styles.container}>
            <TripsHeader
                onNotification={handleNotification}
                notificationCount={3}
            />

            <SearchBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                sortValue={sortBy}
                onSortPress={handleSortPress}
            />

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

            {activeTab === "past" && (
                <View style={{ marginTop: 8, marginBottom: 8 }}>
                    <FilterTags
                        tags={pastFilterTags}
                        activeTagId={pastFilter}
                        onTagPress={(id) => setPastFilter(id as PastFilterType)}
                    />
                </View>
            )}

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
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 40,
    },
    loadingText: {
        color: "#666",
        fontSize: 14,
        marginTop: 12,
    },
    errorText: {
        color: "#ff4444",
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    emptyText: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
        marginTop: 12,
    },
});