import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface CaptionProps {
    children: React.ReactNode;
    style?: object;
}

export const Caption: React.FC<CaptionProps> = ({ children, style = {} }) => (
    <Text style={[styles.caption, style]}>{children}</Text>
);

const styles = StyleSheet.create({
    bodyText: {
        fontSize: 16, // Equivalent to text-base
        color: '#D1D5DB', // Equivalent to text-gray-300
        lineHeight: 24, // Approximates leading-relaxed
    },
    caption: {
        fontSize: 12, // Equivalent to text-xs
        color: '#9CA3AF', // Equivalent to text-gray-400
    },
    heading1: {
        fontSize: 36, // Equivalent to text-4xl
        fontWeight: 'bold', // Equivalent to font-bold
        color: '#FFFFFF', // Equivalent to text-white
        lineHeight: 44, // Approximates leading-tight
    },
    heading2: {
        fontSize: 20, // Equivalent to text-xl
        fontWeight: '600', // Equivalent to font-semibold
        color: '#FFFFFF', // Equivalent to text-white
    },
    smallText: {
        fontSize: 14, // Equivalent to text-sm
        color: '#9CA3AF', // Equivalent to text-gray-400
    },
});