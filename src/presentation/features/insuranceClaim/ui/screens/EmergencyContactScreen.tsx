import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { HeaderSection, LocationSharingSection, RentalDetailsSection, ReportSection, SafetyChecklistSection } from '../organisms';

type NavigationProp = StackNavigationProp<TripStackParamList, 'EmergencyContact'>;
type EmergencyContactRouteProp = RouteProp<TripStackParamList, 'EmergencyContact'>;

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
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<EmergencyContactRouteProp>();

    // SAFE: Extract with fallback
    const { bookingId, rentalDetails: routeRentalDetails } = route.params ?? {};

    // Use route params if passed, else fallback to props (for storybook/testing)
    const finalRentalDetails = routeRentalDetails ?? rentalDetails;

    // SAFETY: Guard against missing data
    if (!finalRentalDetails || !bookingId) {
        return (
        <View style={styles.container}>
            <HeaderSection onCallPress={onCallBranch} />
            <View style={styles.errorContainer}>
            <SafetyChecklistSection items={['Error: Missing rental details']} />
            </View>
        </View>
        );
    }

    const safetyItems = [
        'Ensure you are in a safe location away from traffic',
        'Turn on hazard lights if applicable',
        'Document the incident with photos',
        'Exchange information if another party is involved',
    ];

    const handleReportClaim = () => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        });

        navigation.navigate('IncidentReport', {
        bookingId,
        initialData: {
            dateTime: formattedDateTime,
            location: 'Getting location...',
            address: 'Detecting address...',
        },
        });
    };

    return (
        <View style={styles.container}>
        <HeaderSection onCallPress={onCallBranch} />

        <RentalDetailsSection
            bikeModel={finalRentalDetails.bikeModel}
            licensePlate={finalRentalDetails.licensePlate}
            branch={finalRentalDetails.branch}
        />

        <LocationSharingSection
            isActive={locationSharing}
            onToggle={onLocationToggle}
            onSharePress={onShareLocation}
        />

        <ReportSection onReportPress={handleReportClaim} />

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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});