import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LabelText, ValueText } from '../../atoms';

export interface DetailRowProps {
    label: string;
    value: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <View style={styles.detailRow}>
        <LabelText>{label}</LabelText>
        <ValueText>{value}</ValueText>
    </View>
);

const styles = StyleSheet.create({
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});