import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { SlideshowImagePlaceholder } from '../../atoms/SlideshowImagePlaceholder';

interface HorizontalSlideshowProps {
    height: number;
    imageWidth: number;
    images: ImageSourcePropType[];
    direction?: 'left' | 'right';
    speed?: number;
}

export const HorizontalSlideshow: React.FC<HorizontalSlideshowProps> = ({
    height,
    imageWidth,
    images,
    direction = 'left',
    speed = 1000,
}) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    
    // Duplicate images multiple times for seamless infinite scroll
    const multipliedImages = [...images, ...images, ...images, ...images];
    
    useEffect(() => {
        const itemWidth = imageWidth + 8;
        const totalWidth = itemWidth * images.length;
        const duration = (totalWidth / speed) * 1000;

        if (direction === 'left') {
            scrollX.setValue(0);
            Animated.loop(
                Animated.timing(scrollX, {
                    toValue: -totalWidth,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            scrollX.setValue(-totalWidth);
            Animated.loop(
                Animated.timing(scrollX, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }

        return () => {
            scrollX.stopAnimation();
        };
    }, [scrollX, imageWidth, images.length, direction, speed]);

    return (
        <View style={[styles.container, { height }]}>
            <Animated.View
                style={[
                    styles.scrollContent,
                    {
                        flexDirection: 'row',
                        transform: [{ translateX: scrollX }],
                    },
                ]}
            >
                {multipliedImages.map((img, index) => (
                    <SlideshowImagePlaceholder
                        key={`image-${index}`}
                        imageSource={img}
                        width={imageWidth}
                        height={height}
                        accessibilityLabel={`Slideshow image ${(index % images.length) + 1}`}
                    />
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
});