import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RefreshButton } from "../atoms/buttons/RefreshButton";

interface MapFiltersProps {
    // ❌ COMMENTED OUT - Filter press removed
    // onFilterPress: () => void;
    onRefreshPress: () => void;
    // ❌ COMMENTED OUT - Active filter count removed
    // activeFilterCount?: number;
    showFilterButton?: boolean; // Optional prop to control filter button visibility
}

export const MapFilters: React.FC<MapFiltersProps> = ({
    // ❌ COMMENTED OUT
    // onFilterPress,
    onRefreshPress,
    // ❌ COMMENTED OUT
    // activeFilterCount = 0,
    showFilterButton = false, // Default to false
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ❌ COMMENTED OUT - Filter Button removed */}
                {/* {showFilterButton && (
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
                )} */}

                {/* ✅ Only Refresh Button remains */}
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
    // ❌ COMMENTED OUT - Filter button styles no longer needed
    // filterButton: {
    //     backgroundColor: "#1a1a1a",
    //     paddingHorizontal: 20,
    //     paddingVertical: 12,
    //     borderRadius: 25,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     borderWidth: 1,
    //     borderColor: "#333",
    //     gap: 8,
    // },
    // filterButtonActive: {
    //     backgroundColor: "#d4c5f9",
    //     borderColor: "#d4c5f9",
    // },
    // filterText: {
    //     color: "#fff",
    //     fontWeight: "600",
    //     fontSize: 14,
    // },
    // filterTextActive: {
    //     color: "#000",
    // },
    // dropdownIcon: {
    //     color: "#fff",
    //     fontSize: 12,
    //     marginLeft: 4,
    // },
    // dropdownIconActive: {
    //     color: "#000",
    // },
    // badge: {
    //     backgroundColor: "#fff",
    //     borderRadius: 10,
    //     minWidth: 20,
    //     height: 20,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     paddingHorizontal: 6,
    // },
    // badgeText: {
    //     color: "#000",
    //     fontSize: 11,
    //     fontWeight: "700",
    // },
});