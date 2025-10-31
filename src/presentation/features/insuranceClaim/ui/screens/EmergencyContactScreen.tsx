import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeaderSection, RentalDetailsSection, LocationSharingSection, ReportSection, SafetyChecklistSection } from '../organisms';


export interface EmergencyContactScreenProps {
    rentalDetails: {
        bikeModel: string;
        licensePlate: string;
        branch: string;
    };
    locationSharing: boolean;
    onLocationToggle: (value: boolean) => void;
    onCallBranch: () => void;
    onShareLocation: () => void;
    onReportClaim: () => void;
}

export const EmergencyContactScreen: React.FC<EmergencyContactScreenProps> = ({
    rentalDetails,
    locationSharing,
    onLocationToggle,
    onCallBranch,
    onShareLocation,
    onReportClaim,
    }) => {
    const safetyItems = [
        'Ensure you are in a safe location away from traffic',
        'Turn on hazard lights if applicable',
        'Document the incident with photos',
        'Exchange information if another party is involved',
    ];

    return (
        <View style={styles.container}>
        <HeaderSection onCallPress={onCallBranch} />
        
        <RentalDetailsSection
            bikeModel={rentalDetails.bikeModel}
            licensePlate={rentalDetails.licensePlate}
            branch={rentalDetails.branch}
        />
        
        <LocationSharingSection
            isActive={locationSharing}
            onToggle={onLocationToggle}
            onSharePress={onShareLocation}
        />
        
        <ReportSection onReportPress={onReportClaim} />
        
        <SafetyChecklistSection items={safetyItems} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
});