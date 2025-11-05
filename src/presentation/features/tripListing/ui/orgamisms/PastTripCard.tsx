import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";
import { StarRating } from "../atoms/text/StarRating";
import { VehicleInfo } from "../molecules/VehicleInfo";

export interface PastTrip {
    id: string;
    vehicleName: string;
    vehicleCategory?: string; // ✅ NEW
    dates: string;
    duration?: string; // ✅ NEW
    status: "completed" | "cancelled";
    rating?: number;
    totalAmount?: string;
    refundedAmount?: string;
    hadInsurance?: boolean; // ✅ NEW
    lateReturnFee?: string; // ✅ NEW
}

interface PastTripCardProps {
    trip: PastTrip;
    onViewDetails?: () => void;
    onRentAgain: () => void;
    onViewReceipt: () => void;
    onBookSimilar?: () => void;
}

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
            <View style={styles.header}>
                <StatusBadge status={trip.status} />
                {/* ✅ NEW: Show if had insurance */}
                {trip.hadInsurance && (
                    <View style={styles.insuranceBadge}>
                        <Text style={styles.insuranceIcon}>🛡️</Text>
                        <Text style={styles.insuranceText}>Insured</Text>
                    </View>
                )}
            </View>
            
            <View style={styles.content}>
                <VehicleInfo 
                    name={trip.vehicleName} 
                    dates={trip.dates}
                    category={trip.vehicleCategory} // ✅ Pass category
                    duration={trip.duration} // ✅ Pass duration
                />
                
                {trip.status === "completed" && trip.rating !== undefined && (
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Your rating</Text>
                        <StarRating rating={trip.rating} />
                    </View>
                )}
                
                {/* ✅ NEW: Show late return fee if any */}
                {trip.status === "completed" && trip.lateReturnFee && (
                    <View style={styles.warningRow}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                        <View style={styles.warningContent}>
                            <Text style={styles.warningLabel}>Phí Trả xe Trễ</Text>
                            <Text style={styles.warningAmount}>{trip.lateReturnFee}</Text>
                        </View>
                    </View>
                )}
                
                <View style={styles.row}>
                    <Text style={styles.label}>
                        {trip.status === "cancelled" ? "Refunded amount" : "Total amount"}
                    </Text>
                    <Text style={[
                        styles.amount,
                        trip.status === "cancelled" && styles.refundedAmount
                    ]}>
                        {trip.status === "cancelled" ? trip.refundedAmount : trip.totalAmount}
                    </Text>
                </View>
                
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
                                <Text style={styles.primaryButtonText}>Thuê Lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.secondaryButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onViewReceipt();
                                }}
                            >
                                <Text style={styles.secondaryButtonText}>📄 Xem Hóa Đơn</Text>
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
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginTop: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    insuranceBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    insuranceIcon: {
        fontSize: 12,
    },
    insuranceText: {
        color: "#22c55e",
        fontSize: 10,
        fontWeight: "600",
    },
    content: {
        marginTop: 12,
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
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
        marginTop: 12,
        gap: 8,
    },
    warningIcon: {
        fontSize: 16,
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    label: {
        color: "#999",
        fontSize: 14,
    },
    amount: {
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
        marginTop: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#d4c5f9",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "600",
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
    },
    secondaryButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});