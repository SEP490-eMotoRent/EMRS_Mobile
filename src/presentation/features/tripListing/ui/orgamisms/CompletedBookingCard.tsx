import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";
import { StarRating } from "../atoms/text/StarRating";
import { VehicleInfo } from "../molecules/VehicleInfo";

export interface CompletedBooking {
    id: string;
    vehicleName: string;
    dates: string;
    rating: number;
    totalAmount: string;
    status: "completed" | "cancelled";
    refundedAmount?: string;
}

interface CompletedBookingCardProps {
    booking: CompletedBooking;
    onRentAgain: () => void;
    onViewReceipt: () => void;
    onBookSimilar?: () => void;
}

export const CompletedBookingCard: React.FC<CompletedBookingCardProps> = ({
    booking,
    onRentAgain,
    onViewReceipt,
    onBookSimilar,
}) => {
    return (
        <View style={styles.card}>
            <StatusBadge status={booking.status} />
            
            <View style={styles.content}>
                <VehicleInfo name={booking.vehicleName} dates={booking.dates} />
                
                {booking.status === "completed" && (
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Your rating</Text>
                        <StarRating rating={booking.rating} />
                    </View>
                )}
                
                <View style={styles.row}>
                    <Text style={styles.label}>
                        {booking.status === "cancelled" ? "Refunded amount" : "Total amount"}
                    </Text>
                    <Text style={[
                        styles.amount,
                        booking.status === "cancelled" && styles.refundedAmount
                    ]}>
                        {booking.status === "cancelled" ? booking.refundedAmount : booking.totalAmount}
                    </Text>
                </View>
                
                <View style={styles.actions}>
                    {booking.status === "completed" ? (
                        <>
                            <TouchableOpacity style={styles.primaryButton} onPress={onRentAgain}>
                                <Text style={styles.primaryButtonText}>Thuê Lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryButton} onPress={onViewReceipt}>
                                <Text style={styles.secondaryButtonText}>📄 Xem Biên Bản</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.primaryButton} onPress={onBookSimilar}>
                            <Text style={styles.primaryButtonText}>Đặt tương tự</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
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
