import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../molecules';

export interface ReportSectionProps {
    onReportPress: () => void;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ onReportPress }) => (
    <View style={styles.section}>
        <Button
        icon="document"
        label="Report Insurance Claim"
        onPress={onReportPress}
        variant="secondary"
        />
    </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
});