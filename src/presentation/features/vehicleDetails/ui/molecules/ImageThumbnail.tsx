import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface ImageThumbnailProps {
    uri: string;
    onPress: () => void;
    isSelected?: boolean;
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ 
    uri, 
    onPress, 
    isSelected = false 
}) => {
    return (
        <TouchableOpacity 
            style={[styles.container, isSelected && styles.selected]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image source={{ uri }} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 70,
        height: 70,
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "transparent",
    },
    selected: {
        borderColor: "#a855f7",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
