import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ImageThumbnail } from "../molecules/ImageThumbnail";

interface ImageGalleryProps {
    images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <View style={styles.container}>
            {/* Main Image */}
            <View style={styles.mainImageContainer}>
                <Image 
                    source={{ uri: images[selectedIndex] }} 
                    style={styles.mainImage}
                    resizeMode="contain"
                />
            </View>

            {/* Thumbnails */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailsContainer}
            >
                {images.map((uri, index) => (
                    <ImageThumbnail
                        key={index}
                        uri={uri}
                        onPress={() => setSelectedIndex(index)}
                        isSelected={selectedIndex === index}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
    },
    mainImageContainer: {
        width: "100%",
        aspectRatio: 16 / 10,
        backgroundColor: "#2a2a2a",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
    },
    mainImage: {
        width: "100%",
        height: "100%",
    },
    thumbnailsContainer: {
        gap: 12,
    },
});
