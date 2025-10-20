import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationBellProps {
    count?: number;
    onPress: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.icon}>🔔</Text>
            {count && count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.count}>{count > 9 ? "9+" : count}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        padding: 8,
    },
    icon: {
        fontSize: 22,
    },
    badge: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: "#ef4444",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    count: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
});