import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { CreateInsuranceClaimRequest } from '../../../../../data/models/insurance/insuranceClaim/CreateInsuranceClaimRequest';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { useCreateInsuranceClaim } from '../../hooks/IncidentManagement/useCreateInsuranceClaim';
import { useFormProgress } from '../../hooks/IncidentManagement/useFormProgress';
import { useIncidentForm } from '../../hooks/IncidentManagement/useIncidentForm';
import { useLocation } from '../../hooks/IncidentManagement/useLocation';
import { useVoiceRecording } from '../../hooks/IncidentManagement/useVoiceRecording';
import { ProgressBar } from '../atoms';
import { SubmitButton } from '../molecules';
import {
    DescriptionSection,
    IncidentInfoSection,
    LocationInputSection,
    PhotosDocumentationSection,
} from '../organisms';

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

    const {
        formData,
        errors,
        setIncidentLocation,
        setDescription,
        addPhoto,
        removePhoto,
        validate,
        getIncidentDateTime,
    } = useIncidentForm();

    const { location, isLoading: isLoadingLocation, refreshLocation } = useLocation();
    const { isRecording, recordingDuration, startRecording, stopRecording } = useVoiceRecording();
    const { progress } = useFormProgress(formData);
    const { isLoading, error: apiError, createClaim } = useCreateInsuranceClaim();

    useEffect(() => {
        if (location && !formData.incidentLocation) {
            setIncidentLocation(location.address);
        }
    }, [location, formData.incidentLocation, setIncidentLocation]);

    const getCurrentDateTimeDisplay = (): string => {
        const now = new Date();
        return now.toLocaleString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const handleVoiceNote = async () => {
        if (isRecording) {
            const audioUri = await stopRecording();
            if (audioUri) {
                Alert.alert(
                    'Ghi âm đã lưu',
                    'Tính năng chuyển giọng nói thành văn bản sẽ sớm ra mắt. Vui lòng nhập mô tả bằng tay.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            await startRecording();
        }
    };

    const handleSubmit = async () => {
        if (!validate()) {
            Alert.alert('Lỗi xác thực', 'Vui lòng sửa các lỗi bên dưới');
            return;
        }

        const incidentDate = getIncidentDateTime();
        if (!incidentDate) {
            Alert.alert('Lỗi', 'Ngày giờ không hợp lệ. Vui lòng kiểm tra lại.');
            return;
        }

        const imageFiles = formData.photos.map((uri, index) => ({
            uri,
            type: 'image/jpeg',
            name: `su_co_${Date.now()}_${index}.jpg`,
        })) as any[];

        const request: CreateInsuranceClaimRequest = {
            bookingId,
            incidentDate,
            incidentLocation: formData.incidentLocation,
            description: formData.description,
            incidentImageFiles: imageFiles.length > 0 ? imageFiles : undefined,
        };

        const result = await createClaim(request);

        if (result) {
            Alert.alert('Thành công', 'Yêu cầu bảo hiểm đã được gửi thành công', [
                { text: 'OK', onPress: () => navigation.navigate('Trip') },
            ]);
        } else {
            Alert.alert('Lỗi', apiError || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
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
                    location={location?.address || 'Đang lấy vị trí...'}
                    address={
                        location
                            ? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
                            : 'Đang tải tọa độ GPS...'
                    }
                    isLoadingLocation={isLoadingLocation}
                    onRefreshLocation={refreshLocation}
                />

                <PhotosDocumentationSection
                    photos={formData.photos}
                    onAddPhoto={addPhoto}
                    onRemovePhoto={removePhoto}
                    bookingId={bookingId}
                />

                <LocationInputSection
                    value={formData.incidentLocation}
                    onChangeText={setIncidentLocation}
                    error={errors.incidentLocation}
                />

                <DescriptionSection
                    value={formData.description}
                    onChangeText={setDescription}
                    onVoiceNote={handleVoiceNote}
                    error={errors.description}
                    isRecording={isRecording}
                    recordingDuration={recordingDuration}
                />

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#7C3AED" />
                    </View>
                ) : (
                    <SubmitButton onPress={handleSubmit} />
                )}
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
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
    },
});