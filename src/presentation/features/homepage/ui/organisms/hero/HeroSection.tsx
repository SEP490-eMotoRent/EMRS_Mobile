import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BodyText } from '../../atoms/typography/BodyText';
import { Heading1 } from '../../atoms/typography/Heading1';

export const HeroSection: React.FC = () => (
    <View style={styles.container}>
        <Image
            source={{ uri: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600' }}
            style={styles.image}
            resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
            <Heading1 style={styles.heading}>
                Thuê xe máy điện{'\n'}
                Xanh - Tiện - An toàn
            </Heading1>
            <BodyText style={styles.body}>
                Trải nghiệm di chuyển thân thiện với môi trường
            </BodyText>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 240, // Reduced from 500 to 240
        overflow: 'hidden',
        marginBottom: 24,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    heading: {
        marginBottom: 12,
        lineHeight: 32,
        fontSize: 26, // Slightly smaller
    },
    body: {
        maxWidth: 300,
        fontSize: 14,
    },
});