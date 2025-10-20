import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StarIcon } from '../icons/StarIcon';

interface RatingBadgeProps {
    rating: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating }) => (
    <View style={styles.container}>
        <StarIcon />
        <Text style={styles.text}>{rating}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
});
