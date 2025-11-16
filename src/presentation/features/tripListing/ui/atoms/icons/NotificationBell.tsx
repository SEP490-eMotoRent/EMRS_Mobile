import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationBellProps {
    count?: number;
    onPress: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.bellWrapper}>
                <Text style={styles.icon}>🔔</Text>
            </View>
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
        padding: 4,
    },
    bellWrapper: {
        width: 40,
        height: 40,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        fontSize: 20,
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#ef4444",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: "#000",
    },
    count: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
});