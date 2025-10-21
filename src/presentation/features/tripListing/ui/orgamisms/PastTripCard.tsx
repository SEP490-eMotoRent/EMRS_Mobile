
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";
import { StarRating } from "../atoms/text/StarRating";
import { VehicleInfo } from "../molecules/VehicleInfo";

export interface PastTrip {
    id: string;
    vehicleName: string;
    dates: string;
    status: "completed" | "cancelled";
    rating?: number;
    totalAmount?: string;
    refundedAmount?: string;
}

interface PastTripCardProps {
    trip: PastTrip;
    onViewDetails?: () => void; // ✅ ADDED - Makes entire card tappable
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
            <StatusBadge status={trip.status} />
            
            <View style={styles.content}>
                <VehicleInfo name={trip.vehicleName} dates={trip.dates} />
                
                {trip.status === "completed" && trip.rating !== undefined && (
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Your rating</Text>
                        <StarRating rating={trip.rating} />
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
                                    e.stopPropagation(); // ✅ Prevent card tap
                                    onRentAgain();
                                }}
                            >
                                <Text style={styles.primaryButtonText}>Rent Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.secondaryButton} 
                                onPress={(e) => {
                                    e.stopPropagation(); // ✅ Prevent card tap
                                    onViewReceipt();
                                }}
                            >
                                <Text style={styles.secondaryButtonText}>📄 View Receipt</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={(e) => {
                                e.stopPropagation(); // ✅ Prevent card tap
                                onBookSimilar?.();
                            }}
                        >
                            <Text style={styles.primaryButtonText}>Book Similar</Text>
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