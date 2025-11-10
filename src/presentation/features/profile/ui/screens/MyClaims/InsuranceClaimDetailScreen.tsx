import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import sl from '../../../../../../core/di/InjectionContainer';
import { InsuranceClaimDetailResponse } from '../../../../../../data/models/insurance/insuranceClaim/InsuranceClaimDetailResponse';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { ClaimStatusBadge } from '../../atoms/Badges/ClaimStatusBadge';
import { Icon } from '../../../../insuranceClaim/ui/atoms/icons/Icon';


type InsuranceClaimDetailScreenRouteProp = RouteProp<
    ProfileStackParamList,
    'InsuranceClaimDetail'
>;

type InsuranceClaimDetailScreenNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'InsuranceClaimDetail'
>;

interface InsuranceClaimDetailScreenProps {
    route: InsuranceClaimDetailScreenRouteProp;
    navigation: InsuranceClaimDetailScreenNavigationProp;
}

export const InsuranceClaimDetailScreen: React.FC<InsuranceClaimDetailScreenProps> = ({
    route,
    navigation,
}) => {
    const { claimId } = route.params;
    const [claim, setClaim] = useState<InsuranceClaimDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClaimDetail();
    }, [claimId]);

    const fetchClaimDetail = async () => {
        try {
            setError(null);
            const useCase = sl.getGetInsuranceClaimDetailUseCase();
            const data = await useCase.execute(claimId);
            setClaim(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải chi tiết yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleBack = () => navigation.goBack();

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Icon name="arrow-left" color="#fff" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi Tiết Yêu Cầu</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            </View>
        );
    }

    if (error || !claim) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Icon name="arrow-left" color="#fff" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi Tiết Yêu Cầu</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error || 'Không tìm thấy yêu cầu'}</Text>
                    <TouchableOpacity onPress={fetchClaimDetail} style={styles.retryButton}>
                        <Text style={styles.retryText}>Thử Lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Icon name="arrow-left" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi Tiết Yêu Cầu</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Status Badge */}
                <View style={styles.statusSection}>
                    <ClaimStatusBadge status={claim.status} />
                </View>

                {/* Basic Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông Tin Sự Cố</Text>
                    <View style={styles.infoRow}>
                        <Icon name="calendar" color="#666" size={20} />
                        <Text style={styles.infoLabel}>Ngày Sự Cố:</Text>
                        <Text style={styles.infoValue}>{formatDate(claim.incidentDate)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="location" color="#666" size={20} />
                        <Text style={styles.infoLabel}>Địa Điểm:</Text>
                        <Text style={styles.infoValue}>{claim.incidentLocation}</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionLabel}>Mô Tả:</Text>
                        <Text style={styles.descriptionText}>{claim.description}</Text>
                    </View>
                </View>

                {/* Cost Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chi Phí</Text>
                    <View style={styles.costItem}>
                        <Text style={styles.costLabel}>Tổng Chi Phí:</Text>
                        <Text style={styles.costValue}>{formatCurrency(claim.totalCost)}</Text>
                    </View>
                    <View style={styles.costItem}>
                        <Text style={styles.costLabel}>Bảo Hiểm Chi Trả:</Text>
                        <Text style={styles.insuranceValue}>
                            {formatCurrency(claim.insuranceCoverageAmount)}
                        </Text>
                    </View>
                    <View style={[styles.costItem, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Bạn Cần Trả:</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(claim.renterLiabilityAmount)}
                        </Text>
                    </View>
                </View>

                {/* Incident Images */}
                {claim.incidentImages && claim.incidentImages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Hình Ảnh Sự Cố</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.imagesContainer}>
                                {claim.incidentImages.map((imageUrl, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: imageUrl }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* Created Date */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Tạo lúc: {formatDate(claim.createdAt)}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorText: {
        color: '#f87171',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#00ff00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    statusSection: {
        padding: 16,
    },
    section: {
        backgroundColor: '#1a1a1a',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    infoLabel: {
        color: '#999',
        fontSize: 14,
    },
    infoValue: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    descriptionContainer: {
        marginTop: 8,
    },
    descriptionLabel: {
        color: '#999',
        fontSize: 14,
        marginBottom: 8,
    },
    descriptionText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    costItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    costLabel: {
        color: '#999',
        fontSize: 14,
    },
    costValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    insuranceValue: {
        color: '#00ff00',
        fontSize: 16,
        fontWeight: '600',
    },
    totalRow: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#333',
        marginTop: 8,
    },
    totalLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    totalValue: {
        color: '#f87171',
        fontSize: 18,
        fontWeight: '700',
    },
    imagesContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 12,
    },
});