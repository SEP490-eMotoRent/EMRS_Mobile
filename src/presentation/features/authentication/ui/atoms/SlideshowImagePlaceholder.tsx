import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface SlideshowImagePlaceholderProps {
    imageSource: ImageSourcePropType;
    width: number;
    height: number;
    accessibilityLabel?: string;
}

export const SlideshowImagePlaceholder: React.FC<SlideshowImagePlaceholderProps> = ({
    imageSource,
    width,
    height,
    accessibilityLabel,
}) => {
    return (
        <View
            style={[
                styles.container,
                {
                    width,
                    height,
                },
            ]}
            accessibilityLabel={accessibilityLabel}
        >
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});