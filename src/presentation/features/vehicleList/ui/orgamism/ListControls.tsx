import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SortButton } from "../atoms/buttons/SortButtons";

interface ListControlsProps {
    totalResults: number;
    sortLabel: string;
    onSortPress: () => void;
}

export const ListControls: React.FC<ListControlsProps> = ({
    totalResults,
    sortLabel,
    onSortPress,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.resultsText}>
                {totalResults} of {totalResults}
            </Text>
            <SortButton label={sortLabel} onPress={onSortPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    resultsText: {
        color: "#999",
        fontSize: 13,
    },
});
