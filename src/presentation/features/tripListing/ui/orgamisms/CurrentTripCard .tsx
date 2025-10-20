import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";
import { BookingReference } from "../atoms/text/BookingReference";
import { TimeRemaining } from "../atoms/text/TimeRemaining";
import { VehicleInfo } from "../molecules/VehicleInfo";
import { MapPreview } from "../molecules/MapPreview";

export interface CurrentTrip {
    id: string;
    vehicleName: string;
    dates: string;
    status: "confirmed" | "returned" | "renting";
    timeInfo?: string; // "5 days left" for renting, "Starts in 3 days" for confirmed
    reference: string;
    location?: string; // Only for renting status
    totalAmount?: string; // For confirmed status
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
        <View style={styles.card}>
            <StatusBadge status={trip.status} />
            
            <View style={styles.content}>
                <VehicleInfo name={trip.vehicleName} dates={trip.dates} />
                
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
                
                {trip.status === "confirmed" && trip.totalAmount && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Total amount</Text>
                        <Text style={styles.amount}>{trip.totalAmount}</Text>
                    </View>
                )}
                
                {/* Actions based on status */}
                {trip.status === "renting" && (
                    <>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails}>
                                <Text style={styles.primaryButtonText}>View Details</Text>
                            </TouchableOpacity>
                            {onExtendRental && (
                                <TouchableOpacity style={styles.primaryButton} onPress={onExtendRental}>
                                    <Text style={styles.primaryButtonText}>Extend Rental</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {onReportIssue && (
                            <TouchableOpacity style={styles.reportButton} onPress={onReportIssue}>
                                <Text style={styles.reportButtonText}>Report Issue</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
                
                {trip.status === "confirmed" && (
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails}>
                            <Text style={styles.primaryButtonText}>View Details</Text>
                        </TouchableOpacity>
                        {onCancel && (
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                
                {trip.status === "returned" && (
                    <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails}>
                        <Text style={styles.primaryButtonText}>View Details</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
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