import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvailableBadgeProps {
    openingTime?: string;  // Format: "08:00"
    closingTime?: string;  // Format: "22:00"
}

export const AvailableBadge: React.FC<AvailableBadgeProps> = ({ 
    openingTime, 
    closingTime 
}) => {
    // Determine if currently open (simple logic - can be enhanced)
    const isOpen = checkIfOpen(openingTime, closingTime);
    
    return (
        <View style={[
            styles.badge,
            isOpen ? styles.badgeOpen : styles.badgeClosed
        ]}>
            <View style={[
                styles.dot,
                isOpen ? styles.dotOpen : styles.dotClosed
            ]} />
            <Text style={[
                styles.text,
                isOpen ? styles.textOpen : styles.textClosed
            ]}>
                {isOpen ? "Đang Mở Cửa" : "Đã Đóng Cửa"}
            </Text>
        </View>
    );
};

// Helper function to check if branch is currently open
function checkIfOpen(openingTime?: string, closingTime?: string): boolean {
    if (!openingTime || !closingTime) {
        return true; // Assume open if no hours provided
    }

    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        // Parse opening time (e.g., "08:00")
        const [openHour, openMin] = openingTime.split(':').map(Number);
        const openingTimeInMinutes = openHour * 60 + openMin;

        // Parse closing time (e.g., "22:00")
        const [closeHour, closeMin] = closingTime.split(':').map(Number);
        const closingTimeInMinutes = closeHour * 60 + closeMin;

        // Check if current time is within operating hours
        return currentTimeInMinutes >= openingTimeInMinutes && 
               currentTimeInMinutes < closingTimeInMinutes;
    } catch (error) {
        console.error('Error parsing time:', error);
        return true; // Assume open if parsing fails
    }
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    badgeOpen: {
        backgroundColor: "rgba(34, 197, 94, 0.15)", // Green background
    },
    badgeClosed: {
        backgroundColor: "rgba(239, 68, 68, 0.15)", // Red background
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotOpen: {
        backgroundColor: "#22c55e", // Green
    },
    dotClosed: {
        backgroundColor: "#ef4444", // Red
    },
    text: {
        fontSize: 13,
        fontWeight: "600",
    },
    textOpen: {
        color: "#22c55e",
    },
    textClosed: {
        color: "#ef4444",
    },
});