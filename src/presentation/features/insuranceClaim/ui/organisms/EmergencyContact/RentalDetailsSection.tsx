import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DetailRow } from '../../molecules';

export interface RentalDetailsSectionProps {
    bikeModel: string;
    licensePlate: string;
    branch: string;
}

export const RentalDetailsSection: React.FC<RentalDetailsSectionProps> = ({
    bikeModel,
    licensePlate,
    branch,
}) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe đang thuê</Text>
        <View style={styles.detailsContainer}>
            <DetailRow label="Loại xe" value={bikeModel} />
            <DetailRow label="Biển số" value={licensePlate} />
            <DetailRow label="Chi nhánh" value={branch} />
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
    detailsContainer: {
        gap: 12,
    },
});