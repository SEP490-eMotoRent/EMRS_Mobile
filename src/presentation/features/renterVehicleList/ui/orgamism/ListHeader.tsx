import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FilterButton } from "../../../map/ui/atoms/buttons/FilterButton";
import { MapSearchBar } from "../../../map/ui/molecules/MapSearchBar";


interface ListHeaderProps {
    location: string;
    dateRange: string;
    onSearchPress: () => void;
    onPricePress: () => void;
    onModelPress: () => void;
    onRangePress: () => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
    location,
    dateRange,
    onSearchPress,
    onPricePress,
    onModelPress,
    onRangePress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MapSearchBar
                    location={location}
                    dateRange={dateRange}
                    onPress={onSearchPress}
                />
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
            >
                <FilterButton label="Price" onPress={onPricePress} />
                <FilterButton label="Model" onPress={onModelPress} />
                <FilterButton label="Range" onPress={onRangePress} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    searchContainer: {
        padding: 16,
    },
    filtersContent: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
});