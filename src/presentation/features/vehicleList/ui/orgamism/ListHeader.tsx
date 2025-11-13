import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        <FilterButton label="Giá" onPress={onFilterPress} />
        <FilterButton label="Dòng Xe" onPress={onFilterPress} />
        <FilterButton label="Quãng Đường" onPress={onFilterPress} />
        {/* ✅ REMOVED: "Tính Năng" button - not needed anymore */}
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
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
});