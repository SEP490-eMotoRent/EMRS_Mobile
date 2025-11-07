import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Badge } from '../../atoms/badges/Badge';
import { RatingBadge } from '../../atoms/badges/RatingBadge';
import { SecondaryButton } from '../../atoms/buttons/SecondaryButton';
import { RangeIcon } from '../../atoms/icons/RangeIcon';
import { SpeedIcon } from '../../atoms/icons/SpeedIcon';
import { Caption } from '../../atoms/typography/Caption';
import { Heading2 } from '../../atoms/typography/Heading2';
import { BikeStat } from './BikeStat';

export interface Bike {
    name: string;
    category: string;
    range: string;
    speed: string;
    price: string;
    rating: string;
}

interface BikeCardProps {
    bike: Bike;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike }) => (
    <View style={styles.card}>
        <View style={styles.imageContainer}>
        <Image
            source={{ uri: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400' }}
            style={styles.image}
            resizeMode="cover"
        />
        <RatingBadge rating={bike.rating} />
        </View>

        <View style={styles.content}>
        <View style={styles.header}>
            <Heading2 style={styles.title}>{bike.name}</Heading2>
            <Badge>{bike.category}</Badge>
        </View>

        <View style={styles.statsRow}>
            <BikeStat icon={<RangeIcon />} value={bike.range} />
            <BikeStat icon={<SpeedIcon />} value={bike.speed} />
        </View>

        <View style={styles.footer}>
            <View>
            <Caption style={styles.caption}>Bắt đầu từ: </Caption>
            <Heading2 style={styles.price}>{bike.price}</Heading2>
            </View>
            <SecondaryButton onPress={() => {}}>ĐẶT XE NGAY</SecondaryButton>
        </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F1F1F',
        borderRadius: 16,
        overflow: 'hidden',
        width: 320,
        marginRight: 16,
        flexShrink: 0,
    },
    imageContainer: {
        position: 'relative',
        height: 192,
        backgroundColor: '#27272A',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    caption: {
        marginBottom: 4,
    },
    price: {
        fontSize: 22,
    },
});
