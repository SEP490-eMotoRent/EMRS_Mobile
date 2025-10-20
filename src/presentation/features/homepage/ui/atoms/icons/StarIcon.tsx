import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StarIconProps {
    style?: object;
}

export const StarIcon: React.FC<StarIconProps> = ({ style = {} }) => (
    <Text style={[styles.starIcon, style]}>★</Text>
);

const styles = StyleSheet.create({
    starIcon: {
        color: '#FFFFFF',  // ✅ CHANGED: White (default for RatingBadge)
        fontSize: 12,      // ✅ CHANGED: Small (matches text)
        fontWeight: '600', // ✅ CHANGED: Bold (matches text)
    },
});