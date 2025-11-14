import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RefreshButton } from "../atoms/buttons/RefreshButton";

interface MapFiltersProps {
    onFilterPress: () => void;
    onRefreshPress: () => void;
    activeFilterCount?: number; // Number of active filters
}

export const MapFilters: React.FC<MapFiltersProps> = ({
    onFilterPress,
    onRefreshPress,
    activeFilterCount = 0,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Single Filter Button with Badge */}
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilterCount > 0 && styles.filterButtonActive
                    ]}
                    onPress={onFilterPress}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.filterText,
                        activeFilterCount > 0 && styles.filterTextActive
                    ]}>
                        Bộ Lọc
                    </Text>
                    
                    {/* Badge showing active filter count */}
                    {activeFilterCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                    
                    <Text style={[
                        styles.dropdownIcon,
                        activeFilterCount > 0 && styles.dropdownIconActive
                    ]}>
                        ▾
                    </Text>
                </TouchableOpacity>

                {/* Refresh Button */}
                <RefreshButton onPress={onRefreshPress} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterButton: {
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
        gap: 8,
    },
    filterButtonActive: {
        backgroundColor: "#d4c5f9",
        borderColor: "#d4c5f9",
    },
    filterText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    filterTextActive: {
        color: "#000",
    },
    dropdownIcon: {
        color: "#fff",
        fontSize: 12,
        marginLeft: 4,
    },
    dropdownIconActive: {
        color: "#000",
    },
    badge: {
        backgroundColor: "#fff",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    badgeText: {
        color: "#000",
        fontSize: 11,
        fontWeight: "700",
    },
});