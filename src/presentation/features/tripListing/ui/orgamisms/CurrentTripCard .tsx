import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";

export interface CurrentTrip {
    id: string;
    vehicleName: string;
    vehicleCategory?: string;
    dates: string;
    duration?: string;
    status: "confirmed" | "returned" | "renting";
    timeInfo?: string;
    reference: string;
    location?: string;
    totalAmount?: string;
    depositAmount?: string;
    baseRentalFee?: string;
    hasInsurance?: boolean;
    vehicleAssigned?: boolean;
    hasAdditionalFees?: boolean;
}

interface CurrentTripCardProps {
    trip: CurrentTrip;
    onViewDetails: () => void;
    onReportIssue?: () => void;
    onCancel?: () => void;
}

export const CurrentTripCard: React.FC<CurrentTripCardProps> = ({
    trip,
    onViewDetails,
    onReportIssue,
    onCancel,
}) => {
    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={onViewDetails}
            activeOpacity={0.7}
        >
            {/* Header with status and indicators */}
            <View style={styles.header}>
                <StatusBadge status={trip.status} />
                <View style={styles.indicators}>
                    {trip.hasInsurance && (
                        <View style={styles.insuranceIcon}>
                            <Text style={styles.shieldIcon}>◈</Text>
                        </View>
                    )}
                    {trip.hasAdditionalFees && (
                        <View style={styles.feeBadge}>
                            <Text style={styles.feeBadgeText}>+Phí</Text>
                        </View>
                    )}
                </View>
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

            {/* Time info for renting status */}
            {trip.status === "renting" && trip.timeInfo && (
                <View style={styles.timeAlert}>
                    <Text style={styles.timeAlertIcon}>⚠</Text>
                    <Text style={styles.timeAlertText}>{trip.timeInfo}</Text>
                </View>
            )}

            {/* Booking reference */}
            <Text style={styles.reference}>Booking reference: {trip.reference}</Text>
            
            {/* Amount section - only for confirmed */}
            {trip.status === "confirmed" && (
                <View style={styles.amountSection}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Chi phí thuê</Text>
                        <Text style={styles.amountValue}>{trip.baseRentalFee}</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Deposit</Text>
                        <Text style={styles.amountValue}>{trip.depositAmount}</Text>
                    </View>
                </View>
            )}
            
            {/* Actions */}
            <View style={styles.actions}>
                {trip.status === "confirmed" && (
                    <>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={(e) => {
                                e.stopPropagation();
                                onViewDetails();
                            }}
                        >
                            <Text style={styles.primaryButtonText}>Chi Tiết</Text>
                        </TouchableOpacity>
                        {onCancel && (
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onCancel();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                {(trip.status === "renting" || trip.status === "returned") && (
                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={(e) => {
                            e.stopPropagation();
                            onViewDetails();
                        }}
                    >
                        <Text style={styles.primaryButtonText}>Chi Tiết</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Report issue - only for renting */}
            {trip.status === "renting" && onReportIssue && (
                <TouchableOpacity 
                    style={styles.reportButton} 
                    onPress={(e) => {
                        e.stopPropagation();
                        onReportIssue();
                    }}
                >
                    <Text style={styles.reportButtonText}>⚠ Báo cáo sự cố</Text>
                </TouchableOpacity>
            )}
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
    indicators: {
        flexDirection: "row",
        gap: 8,
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
    feeBadge: {
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(251, 191, 36, 0.3)",
        justifyContent: "center",
    },
    feeBadgeText: {
        color: "#fbbf24",
        fontSize: 10,
        fontWeight: "700",
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
    timeAlert: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    timeAlertIcon: {
        fontSize: 16,
        color: "#ef4444",
    },
    timeAlertText: {
        color: "#ef4444",
        fontSize: 13,
        fontWeight: "600",
    },
    reference: {
        color: "#666",
        fontSize: 11,
        marginBottom: 12,
    },
    amountSection: {
        paddingTop: 12,
        marginBottom: 12,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2a",
        gap: 8,
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
        fontSize: 15,
        fontWeight: "700",
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
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButtonText: {
        color: "#ef4444",
        fontSize: 15,
        fontWeight: "600",
    },
    reportButton: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.2)",
    },
    reportButtonText: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "600",
    },
});