import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { FilterTag } from "../atoms/badges/FilterTags";

interface FilterTagsProps {
    tags: Array<{ id: string; label: string; count?: number }>;
    activeTagId: string | null;
    onTagPress: (id: string | null) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = ({ tags, activeTagId, onTagPress }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <FilterTag
                label="All"
                isActive={activeTagId === null}
                onPress={() => onTagPress(null)}
            />
            {tags.map((tag) => (
                <FilterTag
                    key={tag.id}
                    label={tag.label}
                    count={tag.count}
                    isActive={activeTagId === tag.id}
                    onPress={() => onTagPress(tag.id)}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingTop: 0,        // no top padding
        paddingBottom: 0,     // no bottom padding
        gap: 8,               // keep horizontal spacing between tags
        alignItems: "flex-start", // align to top (no vertical centering)
        backgroundColor: "#000",  // match screen background
    },
});
