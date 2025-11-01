import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { ProgressBar } from '../atoms';
import { SubmitButton } from '../molecules';
import { IncidentInfoSection, PhotosDocumentationSection, LocationInputSection, DescriptionSection, DateTimeSection } from '../organisms';

type NavigationProp = StackNavigationProp<TripStackParamList, 'IncidentReport'>;
type RouteProp = any;

export interface IncidentReportScreenProps {
    initialData?: {
        dateTime: string;
        location: string;
        address: string;
    };
    onSubmit: (data: any) => void;
}

export const IncidentReportScreen: React.FC<IncidentReportScreenProps> = ({
    initialData = {
        dateTime: 'June 8, 2023 • 15:42',
        location: '10.7553° N, 106.4245° E',
        address: 'Nguyen Huu Tho St., District 7',
    },
    onSubmit,
    }) => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();
    const { bookingId } = route.params;

    const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('2025-09-19');
    const [time, setTime] = useState('20:25 PM');

    const handleAddPhoto = (index: number) => {
        console.log('Add photo at index:', index);
    };

    const handleLocationPress = () => {
        console.log('Open location picker');
    };

    const handleVoiceNote = () => {
        console.log('Start voice recording');
    };

    const handleDatePress = () => {
        console.log('Open date picker');
    };

    const handleTimePress = () => {
        console.log('Open time picker');
    };

    const handleSubmit = () => {
        const data = {
        bookingId,
        photos,
        description,
        date,
        time,
        location: initialData.location,
        address: initialData.address,
        };

        onSubmit(data);

        // Return to TripsScreen
        navigation.navigate('Trip');
    };

    return (
        <View style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <ProgressBar progress={75} />

            <IncidentInfoSection
            dateTime={initialData.dateTime}
            location={initialData.location}
            address={initialData.address}
            />

            <PhotosDocumentationSection
            photos={photos}
            onAddPhoto={handleAddPhoto}
            />

            <LocationInputSection onPress={handleLocationPress} />

            <DescriptionSection
            value={description}
            onChangeText={setDescription}
            onVoiceNote={handleVoiceNote}
            />

            <DateTimeSection
            date={date}
            time={time}
            onDatePress={handleDatePress}
            onTimePress={handleTimePress}
            />

            <SubmitButton onPress={handleSubmit} />
        </ScrollView>
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
});