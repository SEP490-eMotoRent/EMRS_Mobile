import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckIcon } from '../../atoms/icons/CheckIcon';
import { CrossIcon } from '../../atoms/icons/CrossIcon';


interface ComparisonFeatureProps {
    text: string;
    isPositive?: boolean;
}

export const ComparisonFeature: React.FC<ComparisonFeatureProps> = ({ 
    text, 
    isPositive = true 
    }) => {
    return (
        <View style={styles.featureRow}>
        {isPositive ? <CheckIcon /> : <CrossIcon />}
        <Text style={isPositive ? styles.featureTextPositive : styles.featureTextNegative}>
            {text}
        </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    featureTextPositive: {
        color: '#e5e7eb',
        fontSize: 16,
        flex: 1,
    },
    featureTextNegative: {
        color: '#9ca3af',
        fontSize: 16,
        flex: 1,
    },
});
