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
        paddingTop: 60,
        paddingBottom: 12,
        backgroundColor: "#000",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
});