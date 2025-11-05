import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FilterButton } from "../atoms/buttons/FilterButton";
import { RefreshButton } from "../atoms/buttons/RefreshButton";


interface MapFiltersProps {
    onPricePress: () => void;
    onModelPress: () => void;
    onAutopilotPress: () => void;
    onRefreshPress: () => void;
    activePriceFilter?: boolean;
    activeModelFilter?: boolean;
    activeAutopilotFilter?: boolean;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
    onPricePress,
    onModelPress,
    onAutopilotPress,
    onRefreshPress,
    activePriceFilter = false,
    activeModelFilter = false,
    activeAutopilotFilter = false,
}) => {
    return (
        <View style={styles.container}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <FilterButton
            label="Giá cả"
            onPress={onPricePress}
            isActive={activePriceFilter}
            />
            <FilterButton
            label="Mẫu Xe"
            onPress={onModelPress}
            isActive={activeModelFilter}
            />
            <FilterButton
            label="Giới hạn"
            onPress={onAutopilotPress}
            isActive={activeAutopilotFilter}
            />
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
    },
});