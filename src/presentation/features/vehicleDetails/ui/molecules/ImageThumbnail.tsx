import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface ImageThumbnailProps {
    uri: string;
    onPress: () => void;
    isSelected: boolean;
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ uri, onPress, isSelected }) => {
    return (
        <TouchableOpacity 
            style={[styles.thumbnail, isSelected && styles.selected]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image source={{ uri }} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "transparent",
    },
    selected: {
        borderColor: "#a78bfa",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});