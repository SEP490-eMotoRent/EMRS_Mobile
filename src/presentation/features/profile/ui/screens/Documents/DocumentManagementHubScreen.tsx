import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { DocumentResponse } from '../../../../../../data/models/account/renter/RenterResponse';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useRenterProfile } from '../../../hooks/profile/useRenterProfile';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icons/Icons';
import { Text } from '../../atoms/Text';

type DocumentManagementHubNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'DocumentManagement'
>;

interface DocumentManagementHubScreenProps {
    navigation: DocumentManagementHubNavigationProp;
}

type DocumentStatus = 'verified' | 'pending' | 'needed' | 'expired';

interface DocumentCardData {
    type: 'citizen' | 'license';
    title: string;
    icon: 'id' | 'license';
    status: DocumentStatus;
    document?: DocumentResponse;
    expiryDate?: string;
}

export const DocumentManagementHubScreen: React.FC<DocumentManagementHubScreenProps> = ({
    navigation,
}) => {
    const { renter, renterResponse, loading, refresh } = useRenterProfile();

    // 🔄 Auto-refresh documents when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('📱 DocumentManagementHub focused - refreshing documents');
            refresh();
        }, [])
    );

    const getDocumentStatus = (doc?: DocumentResponse): DocumentStatus => {
        if (!doc) return 'needed';
        
        const status = doc.verificationStatus?.toLowerCase();
        // ✅ Treat Pending as verified - user has uploaded, that's all they need to do
        if (status === 'approved' || status === 'verified' || status === 'pending') return 'verified';
        
        // Check expiry only for non-license documents (driver's license has no expiry in VN)
        if (doc.expiryDate && doc.documentType === 'Citizen') {
            const expiry = new Date(doc.expiryDate);
            const now = new Date();
            if (expiry < now) return 'expired';
        }
        
        return 'verified'; // Default to verified if uploaded
    };

    const formatExpiryDate = (isoDate?: string): string => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    if (loading && !renterResponse) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7C3AED" />
                </View>
            </SafeAreaView>
        );
    }

    // Extract documents
    const citizenDoc = renterResponse?.documents.find(
        (doc) => doc.documentType === 'Citizen'
    );
    const licenseDoc = renterResponse?.documents.find(
        (doc) =>
            doc.documentType === 'Driving' ||
            doc.documentType === 'License' ||
            doc.documentType === 'DriverLicense'
    );

    const documents: DocumentCardData[] = [
        {
            type: 'citizen',
            title: 'Căn Cước Công Dân',
            icon: 'id',
            status: getDocumentStatus(citizenDoc),
            document: citizenDoc,
            expiryDate: citizenDoc?.expiryDate,
        },
        {
            type: 'license',
            title: 'Giấy Phép Lái Xe',
            icon: 'license',
            status: getDocumentStatus(licenseDoc),
            document: licenseDoc,
            expiryDate: licenseDoc?.expiryDate,
        },
    ];

    const handleNavigateToDocument = (type: 'citizen' | 'license') => {
        if (type === 'citizen') {
            navigation.navigate('CitizenIDVerification');
        } else {
            navigation.navigate('DriverLicenseVerification');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Button
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        variant="ghost"
                    >
                        <Icon name="back" size={24} />
                    </Button>
                    <Text variant="header">Quản Lý Giấy Tờ</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refresh}
                            tintColor="#7C3AED"
                            colors={['#7C3AED']}
                        />
                    }
                >
                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Icon name="info" size={20} color="#7C3AED" />
                        <Text style={styles.infoText}>
                            Vui lòng tải lên và xác thực giấy tờ để sử dụng đầy đủ tính năng của
                            ứng dụng.
                        </Text>
                    </View>

                    {/* Document Cards */}
                    {documents.map((doc, index) => (
                        <DocumentCard
                            key={index}
                            data={doc}
                            onPress={() => handleNavigateToDocument(doc.type)}
                            formatExpiryDate={formatExpiryDate}
                        />
                    ))}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

// Document Card Component
interface DocumentCardProps {
    data: DocumentCardData;
    onPress: () => void;
    formatExpiryDate: (date?: string) => string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ data, onPress, formatExpiryDate }) => {
    const getStatusConfig = (status: DocumentStatus) => {
        switch (status) {
            case 'verified':
                return {
                    label: 'Đã Xác Thực',
                    bgColor: '#10b981',
                    textColor: '#FFFFFF',
                    icon: 'checkmark' as const,
                    buttonText: 'Xem Chi Tiết',
                    buttonBg: '#7C3AED',
                };
            // case 'pending':
            //     return {
            //         label: 'Đang Xử Lý',
            //         bgColor: '#f59e0b',
            //         textColor: '#000000',
            //         icon: 'time' as const,
            //         buttonText: 'Xem Chi Tiết',
            //         buttonBg: '#7C3AED',
            //     };
            case 'expired':
                return {
                    label: 'Đã Hết Hạn',
                    bgColor: '#ef4444',
                    textColor: '#FFFFFF',
                    icon: 'warning' as const,
                    buttonText: 'Cập Nhật Ngay',
                    buttonBg: '#ef4444',
                };
            case 'needed':
            default:
                return {
                    label: 'Cần Tải Lên',
                    bgColor: '#ef4444',
                    textColor: '#FFFFFF',
                    icon: 'warning' as const,
                    buttonText: 'Tải Lên Ngay',
                    buttonBg: '#7C3AED',
                };
        }
    };

    const statusConfig = getStatusConfig(data.status);

    return (
        <TouchableOpacity style={styles.documentCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Icon name={data.icon} size={28} color="#7C3AED" />
                    <Text style={styles.cardTitle}>{data.title}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                    <Icon name={statusConfig.icon} size={14} color={statusConfig.textColor} />
                    <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                        {statusConfig.label}
                    </Text>
                </View>
            </View>

            {/* Document Details */}
            <View style={styles.cardContent}>
                {data.document && data.status !== 'needed' && (
                    <>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Số giấy tờ:</Text>
                            <Text style={styles.detailValue}>
                                {data.document.documentNumber || 'N/A'}
                            </Text>
                        </View>
                        {data.expiryDate && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Ngày hết hạn:</Text>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        data.status === 'expired' && styles.expiredText,
                                    ]}
                                >
                                    {formatExpiryDate(data.expiryDate)}
                                </Text>
                            </View>
                        )}
                    </>
                )}
                {data.status === 'needed' && (
                    <Text style={styles.emptyText}>
                        Chưa có giấy tờ. Vui lòng tải lên để xác thực.
                    </Text>
                )}
            </View>

            {/* Action Button */}
            <View style={[styles.actionButton, { backgroundColor: statusConfig.buttonBg }]}>
                <Text style={styles.actionButtonText}>{statusConfig.buttonText}</Text>
                <Icon name="chevron" size={20} color="#FFFFFF" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    backButton: {
        padding: 8,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 12,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        color: '#AAAAAA',
        fontSize: 14,
        lineHeight: 20,
    },
    documentCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardHeader: {
        marginBottom: 16,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    cardContent: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    detailLabel: {
        color: '#888888',
        fontSize: 14,
    },
    detailValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    expiredText: {
        color: '#ef4444',
    },
    emptyText: {
        color: '#888888',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 12,
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomPadding: {
        height: 40,
    },
});