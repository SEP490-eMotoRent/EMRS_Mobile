import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    sortValue: string;
    onSortPress: () => void;
}

type SortOption = {
    id: string;
    label: string;
};

const SORT_OPTIONS: SortOption[] = [
    { id: "newest", label: "Mới nhất" },
    { id: "oldest", label: "Cũ nhất" },
    { id: "price_high", label: "Giá cao" },
    { id: "price_low", label: "Giá thấp" },
];

export const SearchBar: React.FC<SearchBarProps> = ({
    searchValue,
    onSearchChange,
    sortValue,
    onSortPress,
}) => {
    const [currentSortIndex, setCurrentSortIndex] = useState(0);

    const handleSortToggle = () => {
        const nextIndex = (currentSortIndex + 1) % SORT_OPTIONS.length;
        setCurrentSortIndex(nextIndex);
        onSortPress(); // Notify parent if needed
    };

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
                <View style={styles.sortContent}>
                    <Text style={styles.sortText}>{SORT_OPTIONS[currentSortIndex].label}</Text>
                    <View style={styles.sortIcon}>
                        <View style={styles.chevron} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 4,      // ✅ Reduced from 12 to bring closer to header
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
    },
    sortContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    sortText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        padding: 0,
    },
    sortIcon: {
        width: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    chevron: {
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 5,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#999",
    },
});