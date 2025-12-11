import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../atoms/Icons/Icons";

interface TripsHeaderProps {
    onRefresh: () => void;
    refreshing?: boolean;
}

export const TripsHeader: React.FC<TripsHeaderProps> = ({ 
    onRefresh,
    refreshing = false,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Những chuyến xe đã đặt</Text>
            <TouchableOpacity 
                style={styles.refreshButton} 
                onPress={onRefresh}
                disabled={refreshing}
                activeOpacity={0.7}
            >
                <Icon 
                    name="refresh" 
                    size={20} 
                    color={refreshing ? "#666" : "#B8A4FF"} 
                />
            </TouchableOpacity>
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
        paddingBottom: 8,
        backgroundColor: "#000",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1a1a1a",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
});