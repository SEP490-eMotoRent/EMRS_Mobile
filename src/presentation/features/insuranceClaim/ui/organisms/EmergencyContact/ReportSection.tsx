import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButton } from '../../atoms/buttons/ActionButton';

export interface ReportSectionProps {
    onReportPress: () => void;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ onReportPress }) => (
    <View style={styles.section}>
        <ActionButton
            icon="file-text"
            label="Báo cáo bảo hiểm"
            onPress={onReportPress}
            variant="danger"
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