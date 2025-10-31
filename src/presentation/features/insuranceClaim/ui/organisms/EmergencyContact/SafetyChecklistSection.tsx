import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChecklistItem } from '../../molecules';

export interface SafetyChecklistSectionProps {
    items: string[];
}

export const SafetyChecklistSection: React.FC<SafetyChecklistSectionProps> = ({ items }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Checklist</Text>
        <View style={styles.checklistContainer}>
        {items.map((item, index) => (
            <ChecklistItem key={index} text={item} />
        ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    checklistContainer: {
        gap: 12,
    },
});