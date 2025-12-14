import React from "react";
import { StyleSheet, View } from "react-native";
import { FilterButton } from "../../../map/ui/atoms/buttons/FilterButton";
import { MapSearchBar } from "../../../map/ui/molecules/MapSearchBar";

interface ListHeaderProps {
  location: string;
  dateRange: string;
  onSearchPress: () => void;
  onFilterPress: () => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  location,
  dateRange,
  onSearchPress,
  onFilterPress,
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
      {/* ✅ Single unified filter button */}
      <View style={styles.filterContainer}>
        <FilterButton label="Bộ Lọc" onPress={onFilterPress} />
      </View>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});