import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import sl from "../../../../../core/di/InjectionContainer";
import { Booking } from "../../../../../domain/entities/booking/Booking";
import { CancelBookingUseCase } from "../../../../../domain/usecases/booking/CancelBookingUseCase";
import { GetCurrentRenterBookingsUseCase } from "../../../../../domain/usecases/booking/GetCurrentRenterBookingsUseCase";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { useCancelBooking } from "../../hooks/useCancelBooking";
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
    const [sortBy, setSortBy] = useState("Mới nhất");
    const [pastFilter, setPastFilter] = useState<PastFilterType>(null);

    const getCurrentRenterBookingsUseCase = useMemo(
        () => sl.get<GetCurrentRenterBookingsUseCase>("GetCurrentRenterBookingsUseCase"),
        []
    );
    
    const cancelBookingUseCase = useMemo(
        () => sl.get<CancelBookingUseCase>("CancelBookingUseCase"),
        []
    );
    
    const { bookings, loading, error, refetch } = useGetCurrentRenterBookings(getCurrentRenterBookingsUseCase);
    const { cancelBooking, cancelling } = useCancelBooking(cancelBookingUseCase);

    const formatVnd = (amount?: number) => amount ? `${amount.toLocaleString('vi-VN')}đ` : undefined;

    const formatShortDate = (date: Date) => {
        const months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
                        "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const mapBookingToCurrentTrip = (booking: Booking): CurrentTrip | null => {
        const statusMap: Record<string, "renting" | "confirmed" | "returned"> = {
            "ACTIVE": "renting",
            "RENTING": "renting",
            "CONFIRMED": "confirmed",
            "BOOKED": "confirmed",
            "COMPLETED": "returned",
            "RETURNED": "returned",
        };

        const bookingStatus = booking.bookingStatus?.toUpperCase();
        const status = statusMap[bookingStatus] || "confirmed";
        if (bookingStatus === "CANCELLED") return null;

        const startDate = booking.startDatetime ? formatShortDate(booking.startDatetime) : "";
        const endDate = booking.endDatetime ? formatShortDate(booking.endDatetime) : "";
        const year = booking.startDatetime?.getFullYear() || "";

        const vehicleName = booking.vehicleModel?.modelName || "Xe không xác định";
        const vehicleCategory = booking.vehicleModel?.category || "";

        const calculateDuration = () => {
            if (booking.rentalDays && booking.rentalDays > 0) {
                return `${booking.rentalDays} ngày`;
            }
            if (booking.rentalHours && booking.rentalHours > 0) {
                return `${booking.rentalHours} giờ`;
            }
            return "";
        };

        // ✅ UPDATED: Only show timeInfo for "renting" status, not "confirmed"
        const calculateTimeInfo = () => {
            if (!booking.startDatetime) return undefined;
            const now = new Date();
            const end = booking.endDatetime ? new Date(booking.endDatetime) : null;

            // Only calculate time remaining for active rentals
            if (status === "renting" && end) {
                const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return daysLeft > 0 ? `${daysLeft} ngày còn lại` : "Sắp kết thúc";
            }
            
            // ✅ REMOVED: Don't show "Bắt đầu..." for confirmed bookings
            // The dates are already displayed, no need to repeat
            return undefined;
        };

        return {
            id: booking.id,
            vehicleName,
            vehicleCategory,
            dates: `${startDate} - ${endDate}, ${year}`,
            duration: calculateDuration(),
            status,
            timeInfo: calculateTimeInfo(),
            reference: `#${booking.id.substring(0, 8).toUpperCase()}`,
            location: "Chi nhánh",
            totalAmount: formatVnd(booking.totalAmount),
            depositAmount: formatVnd(booking.depositAmount),
            baseRentalFee: formatVnd(booking.baseRentalFee),
            hasInsurance: !!booking.insurancePackage,
            vehicleAssigned: !!booking.vehicleId,
        };
    };

    const mapBookingToPastTrip = (booking: Booking): PastTrip | null => {
        const bookingStatus = booking.bookingStatus?.toUpperCase();
        if (!["COMPLETED", "CANCELLED"].includes(bookingStatus)) return null;

        const startDate = booking.startDatetime ? formatShortDate(booking.startDatetime) : "";
        const endDate = booking.endDatetime ? formatShortDate(booking.endDatetime) : "";
        const year = booking.startDatetime?.getFullYear() || "";

        const vehicleName = booking.vehicleModel?.modelName || "Xe không xác định";
        const vehicleCategory = booking.vehicleModel?.category || "";

        const calculateDuration = () => {
            if (booking.rentalDays && booking.rentalDays > 0) return `${booking.rentalDays} ngày`;
            if (booking.rentalHours && booking.rentalHours > 0) return `${booking.rentalHours} giờ`;
            return "";
        };

        return {
            id: booking.id,
            vehicleName,
            vehicleCategory,
            dates: `${startDate} - ${endDate}, ${year}`,
            duration: calculateDuration(),
            status: bookingStatus === "COMPLETED" ? "completed" : "cancelled",
            rating: bookingStatus === "COMPLETED" ? 5 : undefined,
            totalAmount: formatVnd(booking.totalAmount),
            refundedAmount: bookingStatus === "CANCELLED" && booking.depositAmount
                ? formatVnd(booking.depositAmount)
                : undefined,
            hadInsurance: !!booking.insurancePackage,
            lateReturnFee: booking.lateReturnFee && booking.lateReturnFee > 0
                ? formatVnd(booking.lateReturnFee)
                : undefined,
        };
    };

    const currentTrips = useMemo(() => 
        bookings.map(mapBookingToCurrentTrip).filter((t): t is CurrentTrip => t !== null),
        [bookings]
    );

    const pastTrips = useMemo(() => 
        bookings.map(mapBookingToPastTrip).filter((t): t is PastTrip => t !== null),
        [bookings]
    );

    const handleNotification = () => {
        console.log("Mở thông báo");
    };

    const handleSortPress = () => {
        console.log("Mở tùy chọn sắp xếp");
    };

    const handleViewDetails = (bookingId: string) => {
        navigation.navigate('BookingDetails', { bookingId });
    };

    const handleExtendRental = (tripId: string) => {
        console.log("Gia hạn thuê", tripId);
    };

    const handleReportIssue = (bookingId: string, trip: CurrentTrip) => {
        navigation.navigate('EmergencyContact', {
            bookingId,
            rentalDetails: {
                bikeModel: trip.vehicleName,
                licensePlate: 'ABC-123',
                branch: trip.location || 'Chi nhánh chính',
            },
        });
    };

    const handleCancelBooking = async (tripId: string) => {
        await cancelBooking(tripId, () => {
            refetch();
        });
    };

    const handleRentAgain = (tripId: string) => {
        console.log("Thuê lại", tripId);
    };

    const handleViewReceipt = (tripId: string) => {
        console.log("Xem hóa đơn", tripId);
    };

    const handleBookSimilar = (tripId: string) => {
        console.log("Đặt xe tương tự", tripId);
    };

    const filteredCurrentTrips = currentTrips.filter(trip =>
        !searchQuery || 
        trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPastTrips = pastTrips.filter(trip => {
        if (pastFilter && trip.status !== pastFilter) return false;
        if (searchQuery) {
            return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   trip.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const pastFilterTags = [
        { id: "completed", label: "Hoàn thành", count: pastTrips.filter(t => t.status === "completed").length },
        { id: "cancelled", label: "Đã hủy", count: pastTrips.filter(t => t.status === "cancelled").length },
    ];

    const renderCurrentTrips = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#7C4DFF" />
                    <Text style={styles.loadingText}>Đang tải chuyến đi...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Lỗi: {error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredCurrentTrips}
                keyExtractor={item => item.id}
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
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>◐</Text>
                        <Text style={styles.emptyTitle}>Chưa có chuyến đi nào được đặt...</Text>
                        <Text style={styles.emptyMessage}>
                            Đã đến lúc lên kế hoạch cho một chuyến đi thật thú vị rồi, chọn ngay một chiếc xe nhé!
                        </Text>
                    </View>
                }
            />
        );
    };

    const renderPastTrips = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#7C4DFF" />
                    <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Lỗi: {error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredPastTrips}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <View style={{ marginTop: index === 0 ? 0 : 4 }}>
                        <PastTripCard
                            trip={item}
                            onViewDetails={() => handleViewDetails(item.id)}
                            onRentAgain={() => handleRentAgain(item.id)}
                            onViewReceipt={() => handleViewReceipt(item.id)}
                            onBookSimilar={item.status === "cancelled" ? () => handleBookSimilar(item.id) : undefined}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>◑</Text>
                        <Text style={styles.emptyTitle}>Chưa có lịch sử chuyến đi</Text>
                        <Text style={styles.emptyMessage}>
                            Các chuyến đi đã hoàn thành hoặc đã hủy sẽ xuất hiện ở đây
                        </Text>
                    </View>
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
                    label="Đang diễn ra"
                    isActive={activeTab === "current"}
                    onPress={() => setActiveTab("current")}
                />
                <TabButton
                    label="Lịch sử"
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

            {cancelling && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#d4c5f9" />
                        <Text style={styles.loadingOverlayText}>Đang hủy đặt xe...</Text>
                    </View>
                </View>
            )}
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
        color: "#aaa",
        fontSize: 14,
        marginTop: 12,
    },
    errorText: {
        color: "#ff4444",
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    // ✅ Enhanced empty state
    emptyState: {
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
        color: "#666",
    },
    emptyTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    emptyMessage: {
        color: "#999",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingBox: {
        backgroundColor: '#1a1a1a',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    loadingOverlayText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});