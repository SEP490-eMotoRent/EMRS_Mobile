import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { container } from "../../../../../core/di/ServiceContainer";
import { Booking } from "../../../../../domain/entities/booking/Booking";
import { Feedback } from "../../../../../domain/entities/booking/Feedback";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { useRenterProfile } from "../../../profile/hooks/profile/useRenterProfile";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useGetCurrentRenterBookings } from "../../hooks/useGetCurrentRenterBookings";
import { FilterTags } from "../molecules/FilterTags";
import { SearchBar } from "../molecules/SearchBar";
import { TabButton } from "../molecules/TabButton";
import { CurrentTrip, CurrentTripCard } from "../orgamisms/CurrentTripCard";
import { PastTrip, PastTripCard } from "../orgamisms/PastTripCard";
import { TripsHeader } from "../orgamisms/TripsHeader";
import { FeedbackModal } from "../orgamisms/modal/FeedbackModal";

type TripsScreenNavigationProp = StackNavigationProp<TripStackParamList, 'Trip'>;

type TabType = "current" | "past";
type CurrentFilterType = "pending" | "booked" | "renting" | null;
type PastFilterType = "completed" | "cancelled" | null;
type SortOption = "newest" | "oldest" | "price_high" | "price_low";

interface FeedbackModalState {
    visible: boolean;
    bookingId: string;
    vehicleName: string;
    existingFeedback: Feedback | null;
}

export const TripsScreen: React.FC = () => {
    const navigation = useNavigation<TripsScreenNavigationProp>();
    const [activeTab, setActiveTab] = useState<TabType>("current");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [currentFilter, setCurrentFilter] = useState<CurrentFilterType>(null);
    const [pastFilter, setPastFilter] = useState<PastFilterType>(null);

    const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
        visible: false,
        bookingId: "",
        vehicleName: "",
        existingFeedback: null,
    });

    const [bookingFeedbacks, setBookingFeedbacks] = useState<Record<string, Feedback | null>>({});

    const { renter } = useRenterProfile();
    const currentRenterName = renter?.account?.fullname || renter?.email || "Bạn";

    const { bookings, loading, error, refetch } = useGetCurrentRenterBookings(
        container.booking.get.currentRenter
    );
    
    const { cancelBooking, cancelling } = useCancelBooking(
        container.booking.cancel
    );

    const checkBookingFeedbacks = useCallback(async (bookingIds: string[]) => {
        const feedbackMap: Record<string, Feedback | null> = {};
        
        await Promise.all(
            bookingIds.map(async (bookingId) => {
                try {
                    const feedbacks = await container.feedback.get.byBookingId.execute(bookingId);
                    feedbackMap[bookingId] = feedbacks.length > 0 ? feedbacks[0] : null;
                } catch {
                    feedbackMap[bookingId] = null;
                }
            })
        );
        
        setBookingFeedbacks(prev => ({ ...prev, ...feedbackMap }));
    }, []);

    React.useEffect(() => {
        const completedBookingIds = bookings
            .filter(b => ["COMPLETED", "RETURNED"].includes(b.bookingStatus?.toUpperCase() || ""))
            .map(b => b.id);
        
        if (completedBookingIds.length > 0) {
            checkBookingFeedbacks(completedBookingIds);
        }
    }, [bookings, checkBookingFeedbacks]);

    const formatVnd = (amount?: number) => amount ? `${amount.toLocaleString('vi-VN')}đ` : undefined;

    const formatShortDate = (date: Date) => {
        const months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
                        "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const mapBookingToCurrentTrip = (booking: Booking): CurrentTrip | null => {
        const bookingStatus = booking.bookingStatus?.toUpperCase();
        
        // Returned, Completed, and Cancelled go to Past trips
        if (["RETURNED", "COMPLETED", "CANCELLED"].includes(bookingStatus)) {
            return null;
        }

        const statusMap: Record<string, "pending" | "booked" | "renting"> = {
            "PENDING": "pending",
            "BOOKED": "booked",
            "ACTIVE": "renting",
            "RENTING": "renting",
        };

        const status = statusMap[bookingStatus] || "booked";

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

        const calculateTimeInfo = () => {
            if (!booking.startDatetime) return undefined;
            const now = new Date();
            const end = booking.endDatetime ? new Date(booking.endDatetime) : null;

            if (status === "renting" && end) {
                const hoursLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60));
                if (hoursLeft < 24) {
                    return `Còn ${hoursLeft} giờ`;
                }
                const daysLeft = Math.ceil(hoursLeft / 24);
                return `Còn ${daysLeft} ngày`;
            }
            
            return undefined;
        };

        const calculatePaymentExpiry = () => {
            if (status !== "pending") return undefined;
            // Assuming payment expires 30 minutes after booking creation
            // You should replace this with actual expiry logic from your backend
            return "15 phút";
        };

        const hasAdditionalFees = !!(
            (booking.additionalFees && booking.additionalFees.length > 0) ||
            booking.lateReturnFee ||
            booking.excessKmFee ||
            booking.cleaningFee ||
            booking.crossBranchFee ||
            booking.totalChargingFee ||
            booking.earlyHandoverFee
        );

            return {
            id: booking.id,
            vehicleName,
            vehicleCategory,
            vehicleImageUrl: (booking.vehicleModel as any)?.imageUrl,
            dates: `${startDate} - ${endDate}, ${year}`,
            duration: calculateDuration(),
            status,
            timeInfo: calculateTimeInfo(),
            reference: `#${booking.id.substring(0, 8).toUpperCase()}`,
            location: booking.handoverBranch?.branchName || "Chi nhánh",
            totalAmount: formatVnd(booking.totalAmount),
            depositAmount: formatVnd(booking.depositAmount),
            baseRentalFee: formatVnd(booking.baseRentalFee),
            hasInsurance: !!booking.insurancePackage,
            vehicleAssigned: !!booking.vehicleId,
            hasAdditionalFees,
            paymentExpiry: calculatePaymentExpiry(),
        };
    };

    const mapBookingToPastTrip = (booking: Booking): PastTrip | null => {
        const bookingStatus = booking.bookingStatus?.toUpperCase();
        
        // Past trips: Returned, Completed, and Cancelled
        if (!["RETURNED", "COMPLETED", "CANCELLED"].includes(bookingStatus)) {
            return null;
        }

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

        // Map status: RETURNED and COMPLETED → "completed", CANCELLED → "cancelled"
        const displayStatus: "completed" | "cancelled" = bookingStatus === "CANCELLED" 
            ? "cancelled" 
            : "completed";

        const feedback = bookingFeedbacks[booking.id];
        const hasFeedback = feedback !== null && feedback !== undefined;

        return {
            id: booking.id,
            vehicleName,
            vehicleCategory,
            vehicleImageUrl: (booking.vehicleModel as any)?.imageUrl,
            dates: `${startDate} - ${endDate}, ${year}`,
            duration: calculateDuration(),
            status: displayStatus,
            rating: hasFeedback ? feedback.rating : undefined,
            totalAmount: formatVnd(booking.totalAmount),
            refundedAmount: bookingStatus === "CANCELLED" && booking.depositAmount
                ? formatVnd(booking.depositAmount)
                : undefined,
            hadInsurance: !!booking.insurancePackage,
            lateReturnFee: booking.lateReturnFee && booking.lateReturnFee > 0
                ? formatVnd(booking.lateReturnFee)
                : undefined,
            hasFeedback,
            cancellationReason: bookingStatus === "CANCELLED"
                ? "Đã hủy bởi người dùng" 
                : undefined,
        };
    };

    const currentTrips = React.useMemo(() => 
        bookings.map(mapBookingToCurrentTrip).filter((t): t is CurrentTrip => t !== null),
        [bookings]
    );

    const pastTrips = React.useMemo(() => 
        bookings.map(mapBookingToPastTrip).filter((t): t is PastTrip => t !== null),
        [bookings, bookingFeedbacks]
    );

    const sortTrips = <T extends CurrentTrip | PastTrip>(trips: T[]): T[] => {
        const sorted = [...trips];
        
        switch (sortOption) {
            case "newest":
                return sorted;
            case "oldest":
                return sorted.reverse();
            case "price_high":
                return sorted.sort((a, b) => {
                    const priceA = parseFloat(a.totalAmount?.replace(/[^0-9]/g, '') || '0');
                    const priceB = parseFloat(b.totalAmount?.replace(/[^0-9]/g, '') || '0');
                    return priceB - priceA;
                });
            case "price_low":
                return sorted.sort((a, b) => {
                    const priceA = parseFloat(a.totalAmount?.replace(/[^0-9]/g, '') || '0');
                    const priceB = parseFloat(b.totalAmount?.replace(/[^0-9]/g, '') || '0');
                    return priceA - priceB;
                });
            default:
                return sorted;
        }
    };

    const handleViewDetails = (bookingId: string) => {
        navigation.navigate('BookingDetails', { bookingId });
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

    const handlePayNow = (tripId: string) => {
        console.log("Thanh toán ngay", tripId);
        // Navigate to payment screen
    };

    const handleExtend = (tripId: string) => {
        console.log("Gia hạn", tripId);
        // Navigate to extension screen
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

    const handleLeaveFeedback = (bookingId: string, vehicleName: string) => {
        const existingFeedback = bookingFeedbacks[bookingId] || null;
        setFeedbackModal({
            visible: true,
            bookingId,
            vehicleName,
            existingFeedback,
        });
    };

    const handleFeedbackSuccess = (newFeedback?: Feedback) => {
        if (newFeedback) {
            setBookingFeedbacks(prev => ({
                ...prev,
                [feedbackModal.bookingId]: newFeedback,
            }));
        }
    };

    const handleCloseFeedbackModal = () => {
        setFeedbackModal({
            visible: false,
            bookingId: "",
            vehicleName: "",
            existingFeedback: null,
        });
    };

    const filteredCurrentTrips = sortTrips(
        currentTrips.filter(trip => {
            // Filter by status
            if (currentFilter && trip.status !== currentFilter) return false;
            
            // Filter by search
            if (searchQuery) {
                return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       trip.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       trip.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        })
    );

    const filteredPastTrips = sortTrips(
        pastTrips.filter(trip => {
            if (pastFilter && trip.status !== pastFilter) return false;
            if (searchQuery) {
                return trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       trip.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        })
    );

    const currentFilterTags = [
        { id: "pending", label: "Chờ thanh toán", count: currentTrips.filter(t => t.status === "pending").length },
        { id: "booked", label: "Đã đặt xe", count: currentTrips.filter(t => t.status === "booked").length },
        { id: "renting", label: "Đang thuê", count: currentTrips.filter(t => t.status === "renting").length },
    ];

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
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refetch} />
                }
                data={filteredCurrentTrips}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <CurrentTripCard
                        trip={item}
                        onViewDetails={() => handleViewDetails(item.id)}
                        onReportIssue={item.status === "renting" ? () => handleReportIssue(item.id, item) : undefined}
                        onCancel={(item.status === "pending" || item.status === "booked") ? () => handleCancelBooking(item.id) : undefined}
                        onPayNow={item.status === "pending" ? () => handlePayNow(item.id) : undefined}
                        onExtend={item.status === "renting" ? () => handleExtend(item.id) : undefined}
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
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refetch} />
                }
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
                            onLeaveFeedback={() => handleLeaveFeedback(item.id, item.vehicleName)}
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
                onRefresh={refetch}
                refreshing={loading}
            />

            <SearchBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                sortOption={sortOption}
                onSortChange={setSortOption}
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

            {/* Filter tags for both tabs */}
            <View style={{ marginTop: 8, marginBottom: 8 }}>
                {activeTab === "current" ? (
                    <FilterTags
                        tags={currentFilterTags}
                        activeTagId={currentFilter}
                        onTagPress={(id) => setCurrentFilter(id as CurrentFilterType)}
                    />
                ) : (
                    <FilterTags
                        tags={pastFilterTags}
                        activeTagId={pastFilter}
                        onTagPress={(id) => setPastFilter(id as PastFilterType)}
                    />
                )}
            </View>

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

            <FeedbackModal
                visible={feedbackModal.visible}
                onClose={handleCloseFeedbackModal}
                bookingId={feedbackModal.bookingId}
                vehicleName={feedbackModal.vehicleName}
                existingFeedback={feedbackModal.existingFeedback}
                renterName={currentRenterName}
                onSuccess={handleFeedbackSuccess}
            />
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