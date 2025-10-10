import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StarIconProps {
    style?: object;
}

export const StarIcon: React.FC<StarIconProps> = ({ style = {} }) => (
    <Text style={[styles.starIcon, style]}>★</Text>
);

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#1F2937', // Equivalent to bg-gray-800
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24, // Equivalent to text-2xl
    },
    grayIcon: {
        color: '#9CA3AF', // Equivalent to text-gray-400
        fontSize: 24, // Match the size for consistency
    },
    starIcon: {
        color: '#FBBF24', // Equivalent to text-yellow-400
        fontSize: 24, // Match the size for consistency
    },
});