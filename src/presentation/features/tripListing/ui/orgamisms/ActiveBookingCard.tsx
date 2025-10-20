import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../atoms/badges/StatusBadge";
import { BookingReference } from "../atoms/text/BookingReference";
import { TimeRemaining } from "../atoms/text/TimeRemaining";
import { MapPreview } from "../molecules/MapPreview";
import { VehicleInfo } from "../molecules/VehicleInfo";

export interface ActiveBooking {
    id: string;
    vehicleName: string;
    dates: string;
    timeRemaining: string;
    reference: string;
    location: string;
}

interface ActiveBookingCardProps {
    booking: ActiveBooking;
    onViewDetails: () => void;
    onExtendRental: () => void;
    onReportIssue: () => void;
}

export const ActiveBookingCard: React.FC<ActiveBookingCardProps> = ({
    booking,
    onViewDetails,
    onExtendRental,
    onReportIssue,
}) => {
    return (
        <View style={styles.card}>
            <StatusBadge status="active" />
            
            <View style={styles.content}>
                <VehicleInfo name={booking.vehicleName} dates={booking.dates} />
                <TimeRemaining time={booking.timeRemaining} />
                <BookingReference reference={booking.reference} />
                
                <MapPreview location={booking.location} />
                
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onViewDetails}>
                        <Text style={styles.secondaryButtonText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onExtendRental}>
                        <Text style={styles.secondaryButtonText}>Extend Rental</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.reportButton} onPress={onReportIssue}>
                    <Text style={styles.reportButtonText}>Report Issue</Text>
                </TouchableOpacity>
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
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 12,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#d4c5f9",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    secondaryButtonText: {
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
});
