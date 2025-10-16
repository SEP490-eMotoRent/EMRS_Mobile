import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MapSearchBarProps {
    location: string;
    dateRange: string;
    onPress: () => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
    location,
    dateRange,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.searchIcon}>🔍</Text>
        <View style={styles.textContainer}>
            <Text style={styles.locationText} numberOfLines={1}>
            {location}
            </Text>
            <Text style={styles.dateText} numberOfLines={1}>
            {dateRange}
            </Text>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    searchIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    locationText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    dateText: {
        color: "#aaa",
        fontSize: 14,
        marginTop: 2,
    },
});