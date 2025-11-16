import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";

export interface PastTrip {
    id: string;
    vehicleName: string;
    vehicleCategory?: string;
    dates: string;
    duration?: string;
    status: "completed" | "cancelled";
    rating?: number;
    totalAmount?: string;
    refundedAmount?: string;
    hadInsurance?: boolean;
    lateReturnFee?: string;
}

interface PastTripCardProps {
    trip: PastTrip;
    onViewDetails?: () => void;
    onRentAgain: () => void;
    onViewReceipt: () => void;
    onBookSimilar?: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <View style={{ flexDirection: "row", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Text key={star} style={{ fontSize: 14, color: star <= rating ? "#fbbf24" : "#666" }}>
                {star <= rating ? "★" : "☆"}
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
                        <Text style={styles.shieldIcon}>◈</Text>
                    </View>
                )}
            </View>
            
            {/* Vehicle info */}
            <View style={styles.vehicleSection}>
                <View style={styles.vehicleIcon}>
                    <Text style={styles.iconText}>🏍</Text>
                </View>
                <View style={styles.vehicleDetails}>
                    <View style={styles.vehicleNameRow}>
                        <Text style={styles.vehicleName}>{trip.vehicleName}</Text>
                        {trip.vehicleCategory && (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{trip.vehicleCategory}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.dates}>{trip.dates}</Text>
                    {trip.duration && (
                        <View style={styles.durationRow}>
                            <Text style={styles.durationIcon}>⏱</Text>
                            <Text style={styles.duration}>{trip.duration}</Text>
                        </View>
                    )}
                </View>
            </View>
            
            {/* Rating - only for completed */}
            {trip.status === "completed" && trip.rating !== undefined && (
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingLabel}>Your rating</Text>
                    <StarRating rating={trip.rating} />
                </View>
            )}
            
            {/* Late return fee warning */}
            {trip.status === "completed" && trip.lateReturnFee && (
                <View style={styles.warningRow}>
                    <Text style={styles.warningIcon}>⚠</Text>
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
                        {trip.status === "cancelled" ? "Refunded amount" : "Total amount"}
                    </Text>
                    <Text style={[
                        styles.amountValue,
                        trip.status === "cancelled" && styles.refundedAmount
                    ]}>
                        {trip.status === "cancelled" ? trip.refundedAmount : trip.totalAmount}
                    </Text>
                </View>
            </View>
            
            {/* Actions */}
            <View style={styles.actions}>
                {trip.status === "completed" ? (
                    <>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={(e) => {
                                e.stopPropagation();
                                onRentAgain();
                            }}
                        >
                            <Text style={styles.primaryButtonText}>Thuê lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.secondaryButton} 
                            onPress={(e) => {
                                e.stopPropagation();
                                onViewReceipt();
                            }}
                        >
                            <Text style={styles.secondaryButtonText}>📋</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={(e) => {
                            e.stopPropagation();
                            onBookSimilar?.();
                        }}
                    >
                        <Text style={styles.primaryButtonText}>Đặt tương tự</Text>
                    </TouchableOpacity>
                )}
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
        marginBottom: 16,
    },
    insuranceIcon: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    shieldIcon: {
        fontSize: 16,
        color: "#22c55e",
    },
    vehicleSection: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    vehicleIcon: {
        width: 56,
        height: 56,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    iconText: {
        fontSize: 30,
    },
    vehicleDetails: {
        flex: 1,
        justifyContent: "center",
    },
    vehicleNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    vehicleName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    categoryBadge: {
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryText: {
        color: "#999",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    dates: {
        color: "#999",
        fontSize: 13,
        marginBottom: 4,
    },
    durationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    durationIcon: {
        fontSize: 14,
        color: "#aaa",
        fontWeight: "600",
    },
    duration: {
        color: "#999",
        fontSize: 12,
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    ratingLabel: {
        color: "#999",
        fontSize: 13,
    },
    warningRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        gap: 8,
    },
    warningIcon: {
        fontSize: 16,
        color: "#ef4444",
    },
    warningContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    warningLabel: {
        color: "#ef4444",
        fontSize: 13,
        fontWeight: "600",
    },
    warningAmount: {
        color: "#ef4444",
        fontSize: 14,
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
        fontSize: 14,
    },
    amountValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    refundedAmount: {
        color: "#22c55e",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#d4c5f9",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#000",
        fontSize: 15,
        fontWeight: "600",
    },
    secondaryButton: {
        width: 48,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    secondaryButtonText: {
        fontSize: 18,
        color: "#fff",
    },
});