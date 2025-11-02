import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { ProgressBar } from '../atoms';
import { SubmitButton } from '../molecules';
import { 
    IncidentInfoSection, 
    PhotosDocumentationSection, 
    LocationInputSection, 
    DescriptionSection, 
    DateTimeSection 
} from '../organisms';
import { CreateInsuranceClaimRequest } from '../../../../../data/models/insurance/CreateInsuranceClaimRequest';
import { useCreateInsuranceClaim } from '../../hooks/IncidentManagement/useCreateInsuranceClaim';
import { useFormProgress } from '../../hooks/IncidentManagement/useFormProgress';
import { useIncidentForm } from '../../hooks/IncidentManagement/useIncidentForm';


type NavigationProp = StackNavigationProp<TripStackParamList, 'IncidentReport'>;
type RouteProp = any;

export interface IncidentReportScreenProps {
    initialData?: {
        dateTime: string;
        location: string;
        address: string;
    };
}

export const IncidentReportScreen: React.FC<IncidentReportScreenProps> = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();
    const { bookingId } = route.params;

    // Form state management
    const {
        formData,
        errors,
        setIncidentLocation,
        setDescription,
        setDate,
        setTime,
        addPhoto,
        removePhoto,
        validate,
        getIncidentDateTime,
    } = useIncidentForm();

    // Dynamic progress tracking
    const { progress } = useFormProgress(formData);

    // API hook
    const { isLoading, error: apiError, createClaim } = useCreateInsuranceClaim();

    // Date/Time picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Format current date/time for display
    const getCurrentDateTimeDisplay = () => {
        const now = new Date();
        return now.toLocaleString('en-US', { 
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setSelectedDate(selectedDate);
            setDate(selectedDate.toISOString().split('T')[0]);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const timeString = selectedTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            setTime(timeString);
        }
    };

    const handleDatePress = () => {
        setShowDatePicker(true);
    };

    const handleTimePress = () => {
        setShowTimePicker(true);
    };

    const handleGpsPress = () => {
        // TODO: Implement GPS location picker
        Alert.alert('GPS Location', 'GPS location picker will be implemented here');
    };

    const handleVoiceNote = () => {
        // TODO: Implement voice recording
        Alert.alert('Voice Note', 'Voice recording will be implemented here');
    };

    const handleSubmit = async () => {
        // Validate form
        if (!validate()) {
            Alert.alert('Validation Error', 'Please fill in all required fields correctly');
            return;
        }

        // Prepare request
        const request: CreateInsuranceClaimRequest = {
            bookingId: bookingId,
            incidentDate: getIncidentDateTime(),
            incidentLocation: formData.incidentLocation,
            description: formData.description,
            incidentImageFiles: formData.photos.length > 0 ? formData.photos : undefined,
        };

        // Submit claim
        const result = await createClaim(request);

        if (result) {
            Alert.alert(
                'Success',
                'Insurance claim submitted successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Trip'),
                    },
                ]
            );
        } else {
            Alert.alert(
                'Error',
                apiError || 'Failed to submit insurance claim. Please try again.'
            );
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ProgressBar progress={progress} />

                <IncidentInfoSection
                    dateTime={getCurrentDateTimeDisplay()}
                    location="Current Location"
                    address="To be determined"
                />

                <PhotosDocumentationSection
                    photos={formData.photos}
                    onAddPhoto={addPhoto}
                    onRemovePhoto={removePhoto}
                />

                <LocationInputSection 
                    value={formData.incidentLocation}
                    onChangeText={setIncidentLocation}
                    onGpsPress={handleGpsPress}
                    error={errors.incidentLocation}
                />

                <DescriptionSection
                    value={formData.description}
                    onChangeText={setDescription}
                    onVoiceNote={handleVoiceNote}
                    error={errors.description}
                />

                <DateTimeSection
                    date={formData.date}
                    time={formData.time}
                    onDatePress={handleDatePress}
                    onTimePress={handleTimePress}
                    dateError={errors.date}
                    timeError={errors.time}
                />

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <SubmitButton onPress={handleSubmit} />
                )}
            </ScrollView>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
    },
});