import React from "react";
import { StyleSheet, View } from "react-native";
import { SortDropdown } from "../atoms/dropdown/SortDropdown";
import { SearchInput } from "../atoms/inputs/SearchInput";

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (text: string) => void;
    sortValue: string;
    onSortPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchValue,
    onSearchChange,
    sortValue,
    onSortPress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchInputContainer}>
                <SearchInput
                    placeholder="Search bookings..."
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>
            <SortDropdown value={sortValue} onPress={onSortPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#000",
    },
    searchInputContainer: {
        flex: 1,
    },
});