import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBadge } from "../atoms/badges/StatusBadge";

export interface PastTrip {
    id: string;
    vehicleName: string;
    vehicleCategory?: string;
    vehicleImageUrl?: string;
    dates: string;
    duration?: string;
    status: "pending" | "booked" | "renting" | "completed" | "cancelled";
    rating?: number;
    totalAmount?: string;
    refundedAmount?: string;
    hadInsurance?: boolean;
    lateReturnFee?: string;
    hasFeedback?: boolean;
    cancellationReason?: string;
}

interface PastTripCardProps {
    trip: PastTrip;
    onViewDetails?: () => void;
    onRentAgain: () => void;
    onViewReceipt: () => void;
    onBookSimilar?: () => void;
    onLeaveFeedback?: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <View style={{ flexDirection: "row", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Text key={star} style={{ fontSize: 13, color: star <= rating ? "#fbbf24" : "#444" }}>
                {star <= rating ? "★" : "★"}
            </Text>
        ))}
    </View>
);

export const PastTripCard: React.FC<PastTripCardProps> = ({
    trip,
    onViewDetails,
    onRentAgain,
    onViewReceipt,
    onBookSimilar,
    onLeaveFeedback,
}) => {
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onViewDetails}
            activeOpacity={0.7}
        >
            {/* Header */}
            <View style={styles.header}>
                <StatusBadge status={trip.status} />
                {trip.hadInsurance && (
                    <View style={styles.insuranceIcon}>
                        <Icon name="shield-alt" size={14} color="#22c55e" solid />
                    </View>
                )}
            </View>
            
            {/* ✅ LARGE VEHICLE IMAGE - Full Width */}
            <View style={styles.imageContainer}>
                {trip.vehicleImageUrl ? (
                    <Image 
                        source={{ uri: trip.vehicleImageUrl }}
                        style={styles.vehicleImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon name="motorcycle" size={48} color="#666" />
                    </View>
                )}
                
                {/* Category Badge Overlay */}
                {trip.vehicleCategory && (
                    <View style={styles.categoryOverlay}>
                        <Text style={styles.categoryText}>{trip.vehicleCategory}</Text>
                    </View>
                )}
            </View>

            {/* ✅ Vehicle Info - Below Image */}
            <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName} numberOfLines={1}>
                    {trip.vehicleName}
                </Text>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Icon name="calendar" size={11} color="#999" solid />
                        <Text style={styles.metaText}>{trip.dates}</Text>
                    </View>
                    {trip.duration && (
                        <View style={styles.metaItem}>
                            <Icon name="clock" size={11} color="#999" solid />
                            <Text style={styles.metaText}>{trip.duration}</Text>
                        </View>
                    )}
                </View>
            </View>
            
            {/* Feedback Section - Shows for completed trips only */}
            {trip.status === "completed" && (
                trip.hasFeedback ? (
                    <TouchableOpacity 
                        style={styles.feedbackRow}
                        onPress={(e) => {
                            e.stopPropagation();
                            onLeaveFeedback?.();
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.feedbackLeft}>
                            <Text style={styles.feedbackLabel}>Đánh giá của bạn</Text>
                            <View style={styles.editHint}>
                                <Icon name="edit" size={9} color="#fbbf24" solid />
                                <Text style={styles.editText}>Chỉnh sửa</Text>
                            </View>
                        </View>
                        <StarRating rating={trip.rating || 0} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.feedbackPrompt}
                        onPress={(e) => {
                            e.stopPropagation();
                            onLeaveFeedback?.();
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.feedbackPromptContent}>
                            <Icon name="star" size={18} color="#d4c5f9" solid />
                            <View>
                                <Text style={styles.feedbackPromptTitle}>Đánh giá chuyến đi</Text>
                                <Text style={styles.feedbackPromptSubtitle}>
                                    Chia sẻ trải nghiệm
                                </Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={14} color="#d4c5f9" />
                    </TouchableOpacity>
                )
            )}
            
            {/* Late return fee warning */}
            {trip.status === "completed" && trip.lateReturnFee && (
                <View style={styles.warningRow}>
                    <Icon name="exclamation-triangle" size={13} color="#ef4444" solid />
                    <View style={styles.warningContent}>
                        <Text style={styles.warningLabel}>Phí trả xe trễ</Text>
                        <Text style={styles.warningAmount}>{trip.lateReturnFee}</Text>
                    </View>
                </View>
            )}
            
            {/* Amount row */}
            <View style={styles.amountSection}>
                <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>
                        {trip.status === "cancelled" ? "Số tiền hoàn" : "Tổng tiền"}
                    </Text>
                    <Text style={[
                        styles.amountValue,
                        trip.status === "cancelled" && styles.refundedAmount
                    ]}>
                        {trip.status === "cancelled" ? trip.refundedAmount : trip.totalAmount}
                    </Text>
                </View>
            </View>
            
            {/* ✅ Actions - Single Row */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onViewDetails?.();
                    }}
                >
                    <Icon name="file-alt" size={13} color="#000" solid />
                    <Text style={styles.primaryButtonText}>Chi tiết</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0a0a0a",
        borderWidth: 1,
        borderColor: "#2a2a2a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    insuranceIcon: {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    // ✅ NEW: Large Image Container
    imageContainer: {
        width: "100%",
        height: 160,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
        marginBottom: 12,
        position: "relative",
    },
    vehicleImage: {
        width: "100%",
        height: "100%",
    },
    placeholderImage: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    categoryOverlay: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    categoryText: {
        color: "#d4c5f9",
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    // ✅ NEW: Vehicle Info Below Image
    vehicleInfo: {
        marginBottom: 12,
    },
    vehicleName: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: "row",
        gap: 16,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    metaText: {
        color: "#999",
        fontSize: 12,
    },
    // Feedback
    feedbackRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(251, 191, 36, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(251, 191, 36, 0.2)",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    feedbackLeft: {
        flex: 1,
        gap: 4,
    },
    feedbackLabel: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    editHint: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    editText: {
        color: "#fbbf24",
        fontSize: 11,
        opacity: 0.8,
    },
    feedbackPrompt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(212, 197, 249, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(212, 197, 249, 0.3)",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    feedbackPromptContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    feedbackPromptTitle: {
        color: "#d4c5f9",
        fontSize: 13,
        fontWeight: "600",
    },
    feedbackPromptSubtitle: {
        color: "#999",
        fontSize: 11,
        marginTop: 2,
    },
    warningRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.2)",
    },
    warningContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    warningLabel: {
        color: "#ef4444",
        fontSize: 12,
        fontWeight: "600",
    },
    warningAmount: {
        color: "#ef4444",
        fontSize: 13,
        fontWeight: "700",
    },
    amountSection: {
        paddingTop: 12,
        marginBottom: 12,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2a",
    },
    amountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    amountLabel: {
        color: "#999",
        fontSize: 13,
    },
    amountValue: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    refundedAmount: {
        color: "#22c55e",
    },
    // ✅ Actions - Single Row
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#d4c5f9",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
    },
    primaryButtonText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "700",
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#2a2a2a",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
    },
    secondaryButtonText: {
        color: "#d4c5f9",
        fontSize: 14,
        fontWeight: "700",
    },
});