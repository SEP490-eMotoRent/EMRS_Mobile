import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";
import { BookingReference } from "../atoms/text/BookingReference";
import { TimeRemaining } from "../atoms/text/TimeRemaining";
import { MapPreview } from "../molecules/MapPreview";
import { VehicleInfo } from "../molecules/VehicleInfo";

export interface CurrentTrip {
    id: string;
    vehicleName: string;
    vehicleCategory?: string; // ✅ NEW
    dates: string;
    duration?: string; // ✅ NEW: "5 days" or "8 hours"
    status: "confirmed" | "returned" | "renting";
    timeInfo?: string;
    reference: string;
    location?: string;
    totalAmount?: string;
    depositAmount?: string; // ✅ NEW
    baseRentalFee?: string; // ✅ NEW
    hasInsurance?: boolean; // ✅ NEW
    vehicleAssigned?: boolean; // ✅ NEW
}

interface CurrentTripCardProps {
    trip: CurrentTrip;
    onViewDetails: () => void;
    onExtendRental?: () => void;
    onReportIssue?: () => void;
    onCancel?: () => void;
}

export const CurrentTripCard: React.FC<CurrentTripCardProps> = ({
    trip,
    onViewDetails,
    onExtendRental,
    onReportIssue,
    onCancel,
}) => {
    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={onViewDetails}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <StatusBadge status={trip.status} />
                {/* ✅ NEW: Show indicators */}
                <View style={styles.indicators}>
                    {trip.hasInsurance && (
                        <View style={styles.indicator}>
                            <Text style={styles.indicatorIcon}>🛡️</Text>
                        </View>
                    )}
                    {trip.vehicleAssigned && (
                        <View style={styles.indicator}>
                            <Text style={styles.indicatorIcon}>✓</Text>
                            <Text style={styles.indicatorText}>Xe đã sẵn sàng</Text>
                        </View>
                    )}
                </View>
            </View>
            
            <View style={styles.content}>
                <VehicleInfo 
                    name={trip.vehicleName} 
                    dates={trip.dates}
                    category={trip.vehicleCategory} // ✅ Pass category
                    duration={trip.duration} // ✅ Pass duration
                />
                
                {trip.timeInfo && trip.status === "renting" && (
                    <TimeRemaining time={trip.timeInfo} />
                )}
                
                {trip.timeInfo && trip.status === "confirmed" && (
                    <View style={styles.info}>
                        <Text style={styles.startsIcon}>📅</Text>
                        <Text style={styles.startsText}>{trip.timeInfo}</Text>
                    </View>
                )}
                
                <BookingReference reference={trip.reference} />
                
                {trip.status === "renting" && trip.location && (
                    <MapPreview location={trip.location} />
                )}
                
                {/* ✅ NEW: Enhanced amount display for confirmed bookings */}
                {trip.status === "confirmed" && (
                    <View style={styles.amountSection}>
                        {trip.baseRentalFee && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Chi phí thuê</Text>
                                <Text style={styles.value}>{trip.baseRentalFee}</Text>
                            </View>
                        )}
                        {trip.depositAmount && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Deposit</Text>
                                <Text style={styles.value}>{trip.depositAmount}</Text>
                            </View>
                        )}
                        {trip.totalAmount && (
                            <View style={[styles.row, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Thành Tiền</Text>
                                <Text style={styles.totalAmount}>{trip.totalAmount}</Text>
                            </View>
                        )}
                    </View>
                )}
                
                {/* Actions based on status */}
                {trip.status === "renting" && (
                    <>
                        <View style={styles.actions}>
                            <TouchableOpacity 
                                style={styles.primaryButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onViewDetails();
                                }}
                            >
                                <Text style={styles.primaryButtonText}>Chi Tiết</Text>
                            </TouchableOpacity>
                            {onExtendRental && (
                                <TouchableOpacity 
                                    style={styles.primaryButton} 
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        onExtendRental();
                                    }}
                                >
                                    <Text style={styles.primaryButtonText}>Tăng giờ thuê</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {onReportIssue && (
                            <TouchableOpacity 
                                style={styles.reportButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onReportIssue();
                                }}
                            >
                                <Text style={styles.reportButtonText}>Report Issue</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
                
                {trip.status === "confirmed" && (
                    <View style={styles.actions}>
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
                    </View>
                )}
                
                {trip.status === "returned" && (
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
    indicators: {
        flexDirection: "row",
        gap: 8,
    },
    indicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    indicatorIcon: {
        fontSize: 12,
    },
    indicatorText: {
        color: "#22c55e",
        fontSize: 10,
        fontWeight: "600",
    },
    content: {
        marginTop: 12,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    startsIcon: {
        fontSize: 12,
    },
    startsText: {
        color: "#999",
        fontSize: 12,
    },
    amountSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        color: "#999",
        fontSize: 13,
    },
    value: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    totalRow: {
        marginTop: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#333",
        marginBottom: 0,
    },
    totalLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    totalAmount: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
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
    reportButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },
    reportButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    cancelButtonText: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "600",
    },
});