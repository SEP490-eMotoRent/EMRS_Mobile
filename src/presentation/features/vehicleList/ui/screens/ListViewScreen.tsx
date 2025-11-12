import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import {
  BrowseStackParamList,
  HomeStackParamList,
} from "../../../../shared/navigation/StackParameters/types";
import { useVehicleModelsPaginated } from "../../hooks/useVehicleModelsPaginated";
import { VehicleModelMapper } from "../../mappers/VehicleModelMapper";
import { MapViewButton } from "../atoms/buttons/MapViewButtons";
import { EmptyState } from "../molecules/state/EmptyState";
import { ErrorState } from "../molecules/state/ErrorState";
import { LoadingState } from "../molecules/state/LoadingState";
import { FilterModal, FilterState } from "../orgamism/FilterModal";
import { ListControls } from "../orgamism/ListControls";
import { ListHeader } from "../orgamism/ListHeader";
import { MotorcycleCard } from "../orgamism/MotorcycleCard";

// ✅ Vietnamese date formatter utility
function formatDateRangeVietnamese(dateRange: string): string {
  if (!dateRange) return '';

  const monthMap: Record<string, string> = {
    'Jan': 'Thg 1', 'Feb': 'Thg 2', 'Mar': 'Thg 3',
    'Apr': 'Thg 4', 'May': 'Thg 5', 'Jun': 'Thg 6',
    'Jul': 'Thg 7', 'Aug': 'Thg 8', 'Sep': 'Thg 9',
    'Oct': 'Thg 10', 'Nov': 'Thg 11', 'Dec': 'Thg 12',
  };

  const timeMap: Record<string, string> = {
    'AM': 'SA', 'PM': 'CH',
  };

  let formatted = dateRange;

  // Replace months
  Object.entries(monthMap).forEach(([eng, viet]) => {
    formatted = formatted.replace(new RegExp(`\\b${eng}\\b`, 'g'), viet);
  });

  // Replace AM/PM
  Object.entries(timeMap).forEach(([eng, viet]) => {
    formatted = formatted.replace(new RegExp(`\\b${eng}\\b`, 'g'), viet);
  });

  // Swap date format: "Thg 11 13" → "13 Thg 11"
  formatted = formatted.replace(/(Thg \d+) (\d+)/g, '$2 $1');

  return formatted;
}

type ListViewRouteProp =
  | RouteProp<BrowseStackParamList, "ListView">
  | RouteProp<HomeStackParamList, "ListView">;
type ListViewNavigationProp =
  | StackNavigationProp<BrowseStackParamList, "ListView">
  | StackNavigationProp<HomeStackParamList, "ListView">;

type SortType = "closest" | "price-low" | "price-high" | "availability";

export const ListView: React.FC = () => {
  const route = useRoute<ListViewRouteProp>();
  const navigation = useNavigation<ListViewNavigationProp>();

  // ✅ Use paginated hook
  const {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    totalItems,
    currentPage,
    totalPages,
    loadInitial,
    loadMore,
    refresh,
  } = useVehicleModelsPaginated();

  const [sortBy, setSortBy] = useState<SortType>("closest");
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // ✅ Filter state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500000],
    models: [],
    rangeKm: [0, 150],
    features: [],
  });

  const { location, dateRange, address } = route.params || {
    location: "Thành phố Hồ Chí Minh, Việt Nam",
    dateRange: "20 Thg 10 | 10:00 SA - 23 Thg 10 | 10:00 SA",
    address: "Thành phố Hồ Chí Minh, Việt Nam",
  };

  // ✅ Load initial data with filters
  useEffect(() => {
    loadInitial({
      startTime: extractStartTime(dateRange),
      endTime: extractEndTime(dateRange),
      branchId: extractBranchId(location),
    });
  }, [dateRange, location]);

  // ✅ Map paginated search items to motorcycles WITH dateRange for price calculation
  const motorcycles = useMemo(() => {
    return VehicleModelMapper.fromSearchItems(items, [], dateRange);
  }, [items, dateRange]); // ✅ Added dateRange dependency

  // ✅ Apply client-side filters
  const filteredMotorcycles = useMemo(() => {
    let filtered = [...motorcycles];

    // Price filter
    if (filters.priceRange[1] < 500000) {
      filtered = filtered.filter(m => 
        m.price >= filters.priceRange[0] && m.price <= filters.priceRange[1]
      );
    }

    // Range filter
    if (filters.rangeKm[1] < 150) {
      filtered = filtered.filter(m => {
        const rangeValue = parseInt(m.range.replace(' Km', '')) || 0;
        return rangeValue >= filters.rangeKm[0] && rangeValue <= filters.rangeKm[1];
      });
    }

    // Model filter
    if (filters.models.length > 0) {
      filtered = filtered.filter(m => 
        filters.models.some(model => 
          m.brand.toLowerCase().includes(model.toLowerCase())
        )
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(m => 
        filters.features.every(feature => {
          if (feature === 'charging') return m.features.includes('Support Charging');
          if (feature === 'gps') return m.features.includes('GPS Tracking');
          return false;
        })
      );
    }

    return filtered;
  }, [motorcycles, filters]);

  // ✅ Enhanced sorting with availability
  const sortedMotorcycles = useMemo(() => {
    const sorted = [...filteredMotorcycles].sort((a, b) => {
      if (sortBy === "closest") return a.distance - b.distance;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "availability") {
        const aAvail = a.countAvailable ?? 0;
        const bAvail = b.countAvailable ?? 0;
        return bAvail - aAvail;
      }
      return 0;
    });
    return sorted;
  }, [filteredMotorcycles, sortBy]);

  const handleSortPress = () => {
    if (sortBy === "closest") setSortBy("price-low");
    else if (sortBy === "price-low") setSortBy("price-high");
    else if (sortBy === "price-high") setSortBy("availability");
    else setSortBy("closest");
  };

  const getSortLabel = () => {
    if (sortBy === "closest") return "Gần Nhất";
    if (sortBy === "price-low") return "Giá: Thấp → Cao";
    if (sortBy === "price-high") return "Giá: Cao → Thấp";
    return "Có Sẵn Nhiều";
  };

  const handleMapViewPress = () => {
    // @ts-ignore
    navigation.navigate("Map", { location, dateRange, address });
  };

  const handleSearchPress = () => {
    setBookingModalVisible(true);
  };

  // ✅ Handle filter apply
  const handleApplyFilters = (newFilters: FilterState) => {
    console.log("🔄 [ListView] Applying filters:", newFilters);
    setFilters(newFilters);
    
    // Optionally reload data with server-side filters
    // loadInitial({
    //   startTime: extractStartTime(dateRange),
    //   endTime: extractEndTime(dateRange),
    //   branchId: extractBranchId(location),
    //   minPrice: newFilters.priceRange[0],
    //   maxPrice: newFilters.priceRange[1],
    //   // ... other filter params
    // });
  };

  // ✅ Infinite scroll handler
  const handleEndReached = () => {
    if (hasMore && !loadingMore && !loading) {
      console.log("🔄 [ListView] Loading more vehicles...");
      loadMore();
    }
  };

  // ✅ Loading footer component
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#d4c5f9" />
        <Text style={styles.loadingFooterText}>
          Đang tải thêm... ({items.length}/{totalItems})
        </Text>
      </View>
    );
  };

  // ✅ Empty state handler
  const renderEmptyComponent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={refresh} />;
    return <EmptyState onAction={refresh} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedMotorcycles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MotorcycleCard motorcycle={item} />}
        ListHeaderComponent={
          <>
            <ListHeader
              location={address}
              dateRange={formatDateRangeVietnamese(dateRange)} // ✅ Vietnamese formatted
              onSearchPress={handleSearchPress}
              onFilterPress={() => setFilterModalVisible(true)}
            />
            <ListControls
              currentCount={sortedMotorcycles.length}
              totalResults={totalItems}
              sortLabel={getSortLabel()}
              onSortPress={handleSortPress}
            />
            {/* ✅ Pagination info - Vietnamese */}
            {totalPages > 1 && (
              <View style={styles.paginationInfo}>
                <Text style={styles.paginationText}>
                  Trang {currentPage} / {totalPages} • Hiển thị {sortedMotorcycles.length} / {totalItems} xe
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        contentContainerStyle={
          sortedMotorcycles.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        stickyHeaderIndices={[0]}
        refreshing={loading}
        onRefresh={refresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={true}
      />

      <View style={styles.mapButtonContainer}>
        <MapViewButton onPress={handleMapViewPress} />
      </View>

      {/* ✅ Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
      />

      {/* ✅ Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
};

// ✅ Helper functions to extract data from route params
function extractStartTime(dateRange: string): string | undefined {
  // Parse "20 Thg 10 | 10:00 SA" format
  // TODO: Implement actual parsing
  return undefined;
}

function extractEndTime(dateRange: string): string | undefined {
  // TODO: Implement actual parsing
  return undefined;
}

function extractBranchId(location: string): string | undefined {
  // TODO: Implement actual parsing
  return undefined;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  listContent: {
    paddingBottom: 80, // Space for map button
  },
  emptyListContent: {
    flexGrow: 1,
  },
  paginationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  paginationText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  loadingFooterText: {
    color: "#999",
    fontSize: 14,
  },
  mapButtonContainer: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
  },
});