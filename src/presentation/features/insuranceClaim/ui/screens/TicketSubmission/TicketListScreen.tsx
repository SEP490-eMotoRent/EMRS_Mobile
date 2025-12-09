import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { TicketResponse } from "../../../../../../data/models/ticket/TicketResponse";
import { TicketTypeDisplay, TicketStatusDisplay } from "../../../../../../domain/entities/operations/tickets/TicketEnums";
import { BackButton } from "../../../../../common/components";
import { TripStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useGetTicketsByBookingId } from "../../../hooks/Ticket/useGetTicketsByBookingId";
import { container } from "../../../../../../core/di/ServiceContainer";

type RoutePropType = RouteProp<TripStackParamList, "TicketList">;
type NavigationPropType = StackNavigationProp<TripStackParamList, "TicketList">;

const getStatusColor = (status: string): string => {
    switch (status) {
        case "Pending":
            return "#f59e0b";
        case "InProgress":
            return "#3b82f6";
        case "Resolved":
            return "#22c55e";
        default:
            return "#666";
    }
};

const getTicketTypeIcon = (ticketType: string): string => {
    switch (ticketType) {
        case "WeakBattery":
            return "🔋";
        case "FlatTyre":
            return "🛞";
        case "UsageGuidance":
            return "❓";
        case "OtherTechnical":
            return "⚙️";
        default:
            return "🎫";
    }
};

export const TicketListScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const { bookingId } = route.params;

    const {
        tickets,
        loading,
        error,
        totalItems,
        refetch,
        loadMore,
        hasMore,
    } = useGetTicketsByBookingId(bookingId, container.support.tickets.getByBookingId);

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleViewDetail = (ticketId: string) => {
        navigation.navigate("TicketDetail", { ticketId });
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderTicketItem = ({ item }: { item: TicketResponse }) => (
        <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => handleViewDetail(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.ticketHeader}>
                <View style={styles.ticketTypeContainer}>
                    <Text style={styles.ticketTypeIcon}>
                        {getTicketTypeIcon(item.ticketType)}
                    </Text>
                    <Text style={styles.ticketType}>
                        {TicketTypeDisplay[item.ticketType as keyof typeof TicketTypeDisplay] || item.ticketType}
                    </Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(item.status)}20` },
                    ]}
                >
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: getStatusColor(item.status) },
                        ]}
                    />
                    <Text
                        style={[
                            styles.statusText,
                            { color: getStatusColor(item.status) },
                        ]}
                    >
                        {TicketStatusDisplay[item.status] || item.status}
                    </Text>
                </View>
            </View>

            <Text style={styles.ticketTitle} numberOfLines={2}>
                {item.title}
            </Text>

            <Text style={styles.ticketDescription} numberOfLines={2}>
                {item.description}
            </Text>

            <View style={styles.ticketFooter}>
                <Text style={styles.ticketDate}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.viewMore}>Xem chi tiết →</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!hasMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#d4c5f9" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyTitle}>Chưa có ticket nào</Text>
                <Text style={styles.emptyMessage}>
                    Bạn chưa gửi báo cáo sự cố nào cho chuyến đi này
                </Text>
            </View>
        );
    };

    if (loading && tickets.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={handleBack} label="Quay lại" />
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle}>Ticket đã gửi</Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d4c5f9" />
                    <Text style={styles.loadingText}>Đang tải danh sách ticket...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={handleBack} label="Quay lại" />
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle}>Ticket đã gửi</Text>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                        <Text style={styles.retryButtonText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={handleBack} label="Quay lại" />
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>Ticket đã gửi</Text>
                    <Text style={styles.headerSubtitle}>
                        {totalItems} ticket{totalItems !== 1 ? "s" : ""}
                    </Text>
                </View>
            </View>

            <FlatList
                data={tickets}
                keyExtractor={(item) => item.id}
                renderItem={renderTicketItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={refetch}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    headerTextBlock: {
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: "#666",
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    ticketCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    ticketTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    ticketTypeIcon: {
        fontSize: 20,
    },
    ticketType: {
        color: "#999",
        fontSize: 13,
        fontWeight: "600",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    ticketTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    ticketDescription: {
        color: "#999",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    ticketFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2a",
    },
    ticketDate: {
        color: "#666",
        fontSize: 12,
    },
    viewMore: {
        color: "#d4c5f9",
        fontSize: 13,
        fontWeight: "600",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#999",
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: "#d4c5f9",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#000",
        fontSize: 15,
        fontWeight: "600",
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: "center",
    },
    emptyState: {
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
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
});