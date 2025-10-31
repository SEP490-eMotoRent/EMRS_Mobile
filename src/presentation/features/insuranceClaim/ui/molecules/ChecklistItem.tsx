import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkmark } from '../atoms';

export interface ChecklistItemProps {
    text: string;
    checked?: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ text, checked = true }) => (
    <View style={styles.checklistItem}>
        <Checkmark checked={checked} />
        <Text style={styles.checklistText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    checklistText: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        lineHeight: 20,
    },
});