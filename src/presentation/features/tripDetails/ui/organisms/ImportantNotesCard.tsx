import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { WarningNote } from '../molecules/WarningNote';
import { ContactButton } from '../molecules/ContactButton';

interface ImportantNotesCardProps {
    cancellationPolicy: string;
    lateArrivalPolicy: string;
    emergencyHotline: string;
    onEmergencyCall: () => void;
}

export const ImportantNotesCard: React.FC<ImportantNotesCardProps> = ({
    cancellationPolicy,
    lateArrivalPolicy,
    emergencyHotline,
    onEmergencyCall,
}) => {
    return (
        <View style={styles.container}>
        <SectionTitle title="Important Notes" />
        <View style={styles.card}>
            <WarningNote
            icon={<CancellationIcon />}
            title="Cancellation policy"
            description={cancellationPolicy}
            type="warning"
            />
            <WarningNote
            icon={<LateArrivalIcon />}
            title="Late arrival"
            description={lateArrivalPolicy}
            type="warning"
            />
            <ContactButton
            icon={<PhoneIcon />}
            label="Emergency Hotline"
            value={emergencyHotline}
            onPress={onEmergencyCall}
            variant="primary"
            />
        </View>
        </View>
    );
};

// Simple icon components
const CancellationIcon = () => (
    <View style={{ width: 20, height: 20 }}>
        <View style={{ 
        width: 16, 
        height: 16, 
        borderRadius: 8, 
        borderWidth: 2, 
        borderColor: '#fff',
        transform: [{ rotate: '45deg' }]
        }} />
    </View>
);

const LateArrivalIcon = () => (
    <View style={{ width: 20, height: 20 }}>
        <View style={{ 
        width: 16, 
        height: 16, 
        borderRadius: 8, 
        borderWidth: 2, 
        borderColor: '#fff'
        }}>
        <View style={{
            position: 'absolute',
            top: 6,
            left: 7,
            width: 2,
            height: 6,
            backgroundColor: '#fff'
        }} />
        </View>
    </View>
);

const PhoneIcon = () => (
    <View style={{ width: 20, height: 20 }}>
        <View style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#F44336',
        }} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
    },
});