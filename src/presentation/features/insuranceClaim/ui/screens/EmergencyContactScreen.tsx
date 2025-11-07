import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Linking, Alert, ScrollView } from 'react-native';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { 
    RentalDetailsSection, 
    SafetyChecklistSection 
} from '../organisms';
import sl from '../../../../../core/di/InjectionContainer';
import { GetBookingByIdUseCase } from '../../../../../domain/usecases/booking/GetBookingByIdUseCase';
import { useEmergencyContactData } from '../../hooks/useEmergencyContactData';
import { ActionButton } from '../atoms/buttons/ActionButton';
import { BackButton } from '../../../../common/components/atoms/buttons/BackButton';

type NavigationProp = StackNavigationProp<TripStackParamList, 'EmergencyContact'>;
type EmergencyContactRouteProp = RouteProp<TripStackParamList, 'EmergencyContact'>;

export interface EmergencyContactScreenProps {
    rentalDetails?: {
        bikeModel: string;
        licensePlate: string;
        branch: string;
    };
    onCallBranch?: () => void;
    onReportClaim?: () => void;
}

export const EmergencyContactScreen: React.FC<EmergencyContactScreenProps> = ({
    rentalDetails: propsRentalDetails,
}) => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<EmergencyContactRouteProp>();

    const { bookingId, rentalDetails: routeRentalDetails } = route.params ?? {};

    const getBookingByIdUseCase = useMemo(
        () => new GetBookingByIdUseCase(sl.get("BookingRepository")),
        []
    );

    const { data: emergencyData, loading, error } = useEmergencyContactData(
        bookingId || '',
        getBookingByIdUseCase
    );

    const finalRentalDetails = emergencyData?.vehicleInfo
        ? {
                bikeModel: emergencyData.vehicleInfo.model,
                licensePlate: emergencyData.vehicleInfo.licensePlate,
                branch: emergencyData.branchInfo.name,
            }
        : routeRentalDetails ?? propsRentalDetails;

    const branchPhone = emergencyData?.branchInfo.phone;

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleCallBranch = () => {
        if (branchPhone && branchPhone !== '1900-XXXX' && branchPhone !== 'N/A') {
            const phoneUrl = `tel:${branchPhone}`;
            Linking.canOpenURL(phoneUrl)
                .then((supported) => {
                    if (supported) {
                        return Linking.openURL(phoneUrl);
                    } else {
                        Alert.alert('Lỗi', `Không thể gọi: ${branchPhone}`);
                    }
                })
                .catch(() => {
                    Alert.alert('Lỗi', 'Không thể mở ứng dụng gọi');
                });
        } else {
            Alert.alert('Liên hệ chi nhánh', 'Số điện thoại chi nhánh không khả dụng. Vui lòng liên hệ hỗ trợ.');
        }
    };

    const handleReportClaim = () => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString('vi-VN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        navigation.navigate('IncidentReport', {
            bookingId: bookingId || '',
            initialData: {
                dateTime: formattedDateTime,
                location: 'Đang xác định vị trí...',
                address: 'Đang phát hiện địa chỉ...',
            },
        });
    };

    const safetyItems = [
        'Đảm bảo bạn đang ở vị trí an toàn, tránh xa giao thông',
        'Bật đèn cảnh báo nếu có thể',
        'Chụp ảnh hiện trường sự cố',
        'Trao đổi thông tin nếu có bên thứ ba liên quan',
    ];

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <BackButton onPress={handleGoBack} label="Quay lại" />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00ff00" />
                    <Text style={styles.loadingText}>Đang tải thông tin liên hệ khẩn cấp...</Text>
                </View>
            </View>
        );
    }

    if (error && !emergencyData) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTop}>
                        <BackButton onPress={handleGoBack} label="Quay lại" />
                    </View>
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle}>Liên hệ khẩn cấp</Text>
                        <Text style={styles.headerSubtitle}>Nhận hỗ trợ ngay lập tức</Text>
                    </View>
                </View>

                <ScrollView 
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>Warning</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <Text style={styles.errorSubtext}>
                            Bạn vẫn có thể gọi cứu hộ hoặc sử dụng danh sách kiểm tra an toàn bên dưới.
                        </Text>
                    </View>
                    <SafetyChecklistSection items={safetyItems} />
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                <View style={styles.fixedButtonContainer}>
                    <ActionButton
                        icon="phone"
                        label="Gọi chi nhánh"
                        onPress={handleCallBranch}
                        variant="primary"
                    />
                </View>
            </View>
        );
    }

    if (!bookingId || !finalRentalDetails) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTop}>
                        <BackButton onPress={handleGoBack} label="Quay lại" />
                    </View>
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle}>Liên hệ khẩn cấp</Text>
                        <Text style={styles.headerSubtitle}>Nhận hỗ trợ ngay lập tức</Text>
                    </View>
                </View>

                <ScrollView 
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>Warning</Text>
                        <Text style={styles.errorText}>Thiếu thông tin đặt xe</Text>
                        <Text style={styles.errorSubtext}>
                            Một số tính năng có thể không khả dụng. Vui lòng quay lại chuyến đi và thử lại.
                        </Text>
                    </View>
                    <SafetyChecklistSection items={safetyItems} />
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                <View style={styles.fixedButtonContainer}>
                    <ActionButton
                        icon="phone"
                        label="Gọi chi nhánh"
                        onPress={handleCallBranch}
                        variant="primary"
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <BackButton onPress={handleGoBack} label="Quay lại" />
                </View>
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>Liên hệ khẩn cấp</Text>
                    <Text style={styles.headerSubtitle}>Nhận hỗ trợ ngay lập tức</Text>
                </View>
            </View>

            <ScrollView 
                style={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {emergencyData?.renterInfo && (
                    <View style={styles.prominentCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardIcon}>Person</Text>
                            <Text style={styles.cardTitle}>Thông tin liên hệ của bạn</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Họ tên</Text>
                            <Text style={styles.infoValue}>{emergencyData.renterInfo.name}</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Số điện thoại</Text>
                            <Text style={styles.infoValue}>{emergencyData.renterInfo.phone}</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValueSmall}>{emergencyData.renterInfo.email}</Text>
                        </View>
                    </View>
                )}

                <RentalDetailsSection
                    bikeModel={finalRentalDetails.bikeModel}
                    licensePlate={finalRentalDetails.licensePlate}
                    branch={finalRentalDetails.branch}
                />

                {emergencyData?.bookingContext && (
                    <View style={styles.compactCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardIcon}>Clipboard</Text>
                            <Text style={styles.cardTitle}>Thông tin đặt xe</Text>
                        </View>
                        <View style={styles.compactInfoGrid}>
                            <View style={styles.compactInfoItem}>
                                <Text style={styles.compactLabel}>Mã đặt xe</Text>
                                <Text style={styles.compactValue}>
                                    #{emergencyData.bookingContext.id.slice(-8).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.compactInfoItem}>
                                <Text style={styles.compactLabel}>Trạng thái</Text>
                                <Text style={[styles.compactValue, styles.statusBadge]}>
                                    {emergencyData.bookingContext.status}
                                </Text>
                            </View>
                        </View>
                        {emergencyData.bookingContext.startDate && emergencyData.bookingContext.endDate && (
                            <>
                                <View style={styles.infoDivider} />
                                <View style={styles.infoRow}>
                                    <Text style={styles.compactLabel}>Thời gian thuê</Text>
                                    <Text style={styles.compactValueSmall}>
                                        {new Date(emergencyData.bookingContext.startDate).toLocaleDateString('vi-VN', { 
                                            day: 'numeric', 
                                            month: 'short' 
                                        })} - {new Date(emergencyData.bookingContext.endDate).toLocaleDateString('vi-VN', { 
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                )}

                <SafetyChecklistSection items={safetyItems} />

                <View style={styles.bottomSpacing} />
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <View style={styles.buttonRow}>
                    <View style={styles.secondaryButton}>
                        <ActionButton
                            icon="file-text"
                            label="Báo cáo bảo hiểm"
                            onPress={handleReportClaim}
                            variant="danger"
                        />
                    </View>
                    <View style={styles.primaryButton}>
                        <ActionButton
                            icon="phone"
                            label="Gọi chi nhánh"
                            onPress={handleCallBranch}
                            variant="primary"
                        />
                    </View>
                </View>
            </View>
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
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#999',
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorSubtext: {
        color: '#999',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    prominentCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    infoValueSmall: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    infoDivider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 4,
    },
    compactCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    compactInfoGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    compactInfoItem: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        padding: 12,
    },
    compactLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    compactValue: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    compactValueSmall: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    statusBadge: {
        color: '#00ff00',
        textTransform: 'capitalize',
    },
    bottomSpacing: {
        height: 100,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingBottom: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
    },
    primaryButton: {
        flex: 1.2,
    },
});