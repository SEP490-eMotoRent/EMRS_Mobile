import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../atoms/buttons/ActionButton';

export interface HeaderSectionProps {
    onCallPress: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ onCallPress }) => (
    <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Emergency Contact</Text>
        <Text style={styles.headerSubtitle}>Get immediate assistance</Text>
        <ActionButton
            icon="phone"
            label="Call Branch Hotline"
            onPress={onCallPress}
            variant="primary"
        />
    </View>
);

const styles = StyleSheet.create({
    headerSection: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 16,
    },
});