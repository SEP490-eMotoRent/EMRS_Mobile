import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NotificationBell } from "../atoms/icons/NotificationBell";

interface TripsHeaderProps {
    onNotification: () => void;
    notificationCount?: number;
}

export const TripsHeader: React.FC<TripsHeaderProps> = ({ 
    onNotification, 
    notificationCount 
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Những chuyến xe đã đặt</Text>
            <NotificationBell count={notificationCount} onPress={onNotification} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 8,  // ✅ Reduced from 16 to bring search bar closer
        backgroundColor: "#000",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
});