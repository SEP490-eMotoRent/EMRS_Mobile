import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    sortOption: "newest" | "oldest" | "price_high" | "price_low";
    onSortChange: (option: "newest" | "oldest" | "price_high" | "price_low") => void;
}

const SORT_OPTIONS = [
    { id: "newest" as const, label: "Mới nhất" },
    { id: "oldest" as const, label: "Cũ nhất" },
    { id: "price_high" as const, label: "Giá cao" },
    { id: "price_low" as const, label: "Giá thấp" },
];

export const SearchBar: React.FC<SearchBarProps> = ({
    searchValue,
    onSearchChange,
    sortOption,
    onSortChange,
}) => {
    const handleSortToggle = () => {
        const currentIndex = SORT_OPTIONS.findIndex(opt => opt.id === sortOption);
        const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
        onSortChange(SORT_OPTIONS[nextIndex].id);
    };

    const currentLabel = SORT_OPTIONS.find(opt => opt.id === sortOption)?.label || "Mới nhất";

    return (
        <View style={styles.container}>
            <View style={styles.searchInputWrapper}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm chuyến xe của bạn..."
                    placeholderTextColor="#666"
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>
            <TouchableOpacity 
                style={styles.sortButton} 
                onPress={handleSortToggle} 
                activeOpacity={0.7}
            >
                <Text style={styles.sortText}>{currentLabel}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 12,
        backgroundColor: "#000",
    },
    searchInputWrapper: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        paddingHorizontal: 16,
        height: 48,
        justifyContent: "center",
    },
    searchInput: {
        color: "#fff",
        fontSize: 15,
        padding: 0,
    },
    sortButton: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        paddingHorizontal: 16,
        height: 48,
        justifyContent: "center",
        minWidth: 110,
        alignItems: "center",
    },
    sortText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
});