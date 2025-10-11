import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ComparisonFeature } from '../../molecules/features/ComparisonFeature';

export const ComparisonSection: React.FC = () => {
    const eMotoFeatures = [
        "No down payment",
        "Flexible plans starting week to week",
        "No depreciation or resell fees",
        "Maintenance included",
        "Delivered to you, just like lunch"
    ];

    const traditionalIssues = [
        "Thousands of dollars, gone.",
        "Locked in for years",
        "Lose money with every mile",
        "Pay out of pocket for everything",
        "Not delivered to you"
    ];

    return (
        <View style={styles.section}>
        <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonMainTitle}>
            More Convenience, Less Commitment
            </Text>
            <Text style={styles.comparisonSubtitle}>
            Why eMotoRent Subscriptions Beat Every other option
            </Text>
        </View>

        <View style={styles.comparisonContainer}>
            <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonColumnTitle}>eMotoRent Subscription</Text>
            {eMotoFeatures.map((feature, index) => (
                <ComparisonFeature key={index} text={feature} isPositive={true} />
            ))}
            </View>

            <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonColumnTitle}>Traditional Ownership</Text>
            {traditionalIssues.map((issue, index) => (
                <ComparisonFeature key={index} text={issue} isPositive={false} />
            ))}
            </View>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    comparisonHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    comparisonMainTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    comparisonSubtitle: {
        color: '#9ca3af',
        fontSize: 18,
        textAlign: 'center',
    },
    comparisonContainer: {
        backgroundColor: 'rgba(31, 41, 55, 0.3)',
        borderRadius: 24,
        padding: 24,
    },
    comparisonColumn: {
        marginBottom: 32,
    },
    comparisonColumnTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
    },
});
