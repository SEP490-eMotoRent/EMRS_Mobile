import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BodyText } from '../../atoms/typography/BodyText';
import { Heading2 } from '../../atoms/typography/Heading2';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <View style={styles.card}>
        <View style={styles.icon}>{icon}</View>
        <Heading2 style={styles.title}>{title}</Heading2>
        <BodyText style={styles.description}>{description}</BodyText>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F1F1F',
        padding: 24,
        borderRadius: 16,
        marginBottom: 16,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#D1D5DB',
    },
});
