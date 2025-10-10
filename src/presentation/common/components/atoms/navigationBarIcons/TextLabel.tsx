import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TextLabelProps {
    children: string;
    color?: string;
    fontSize?: number;
    fontWeight?: TextStyle['fontWeight'];
}

export const TextLabel: React.FC<TextLabelProps> = ({
    children,
    color = '#000000',
    fontSize = 12,
    fontWeight = '400',
    }) => {
    return (
        <Text
        style={[
            styles.text,
            {
            color,
            fontSize,
            fontWeight,
            },
        ]}
        >
        {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
    },
});