import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CreateInsuranceClaimRequest } from '../../../../../data/models/insurance/insuranceClaim/CreateInsuranceClaimRequest';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { useCreateInsuranceClaim } from '../../hooks/IncidentManagement/useCreateInsuranceClaim';
import { useFormProgress } from '../../hooks/IncidentManagement/useFormProgress';
import { useIncidentForm } from '../../hooks/IncidentManagement/useIncidentForm';
import { useLocation } from '../../hooks/IncidentManagement/useLocation';
import { BackButton } from '../../../../common/components/atoms/buttons/BackButton';
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
    const { progress } = useFormProgress(formData);
    const { isLoading, error: apiError, createClaim } = useCreateInsuranceClaim();

    const [manualLocation, setManualLocation] = useState<string>('');

    useEffect(() => {
        if (location && !formData.incidentLocation && !manualLocation) {
            const autoLocation = location.address || 
                `GPS: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
            setIncidentLocation(autoLocation);
        }
    }, [location, formData.incidentLocation, manualLocation, setIncidentLocation]);

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

    const handleLocationChange = (text: string) => {
        setManualLocation(text);
        setIncidentLocation(text);
    };

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleSubmit = async () => {
        if (!validate()) {
            Alert.alert('Lỗi xác thực', 'Vui lòng điền đầy đủ thông tin bắt buộc');
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
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <BackButton onPress={handleGoBack} label="Quay lại" />
                </View>
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>Báo cáo sự cố</Text>
                    <Text style={styles.headerSubtitle}>Gửi thông tin chi tiết về sự cố</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ProgressBar progress={progress} />

                <IncidentInfoSection
                    dateTime={getCurrentDateTimeDisplay()}
                    location={
                        location?.address || 
                        (location ? `GPS: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 'Đang lấy vị trí...')
                    }
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
                    onChangeText={handleLocationChange}
                    error={errors.incidentLocation}
                />

                <DescriptionSection
                    value={formData.description}
                    onChangeText={setDescription}
                    error={errors.description}
                />

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#d4c5f9" />
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
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    headerTop: {
        marginBottom: 12,
    },
    headerTextBlock: {},
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
    },
});