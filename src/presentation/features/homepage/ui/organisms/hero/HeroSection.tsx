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
            Chiếc xe tương lai{'\n'}
            Thuê xe máy điện{'\n'}
            cao cấp
        </Heading1>
        <BodyText style={styles.body}>
            Trải nghiệm cảm giác lái xe thân thiện với môi trường với đội xe máy điện cao cấp của chúng tôi.
            Không thải khí, tối đa hứng khởi.
        </BodyText>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 500,
        overflow: 'hidden',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    heading: {
        marginBottom: 16,
        lineHeight: 36,
    },
    body: {
        maxWidth: 350,
    },
});