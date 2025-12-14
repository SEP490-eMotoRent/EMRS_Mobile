import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

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
            {/* ✅ Updated: FontAwesome search icon */}
            <FontAwesome name="search" size={20} color="#fff" style={styles.searchIcon} />
            
            <View style={styles.textContainer}>
                <Text style={styles.locationText} numberOfLines={1}>
                    {location}
                </Text>
                <Text style={styles.dateText} numberOfLines={1}>
                    {dateRange}
                </Text>
            </View>
            
            <View style={styles.currentLocationButton}>
                {/* ✅ Updated: FontAwesome crosshairs icon */}
                <FontAwesome name="crosshairs" size={16} color="#fff" />
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
        marginRight: 12,
    },
    currentLocationButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
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