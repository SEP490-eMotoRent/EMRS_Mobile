import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LabelText, ValueText } from '../../atoms';

export interface InfoRowProps {
    label: string;
    value: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.row}>
        <LabelText>{label}</LabelText>
        <ValueText>{value}</ValueText>
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
});