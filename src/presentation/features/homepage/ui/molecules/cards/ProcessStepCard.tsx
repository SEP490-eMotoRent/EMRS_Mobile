import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading2 } from '../../atoms/typography/Heading2';
import { SmallText } from '../../atoms/typography/SmallText';

interface ProcessStepCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ icon, title, description }) => (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            {icon}
        </View>
        <Heading2 style={styles.title}>{title}</Heading2>
        <SmallText style={styles.description}>{description}</SmallText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
});