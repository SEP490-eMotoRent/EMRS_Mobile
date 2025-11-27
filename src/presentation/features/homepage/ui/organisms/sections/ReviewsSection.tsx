import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReviewCard } from '../../molecules/cards/ReviewCard';
import { GetAllFeedbacksUseCase } from '../../../../../../domain/usecases/feedback/GetAllFeedbacksUseCase';
import { useGetAllFeedbacks } from '../../../hooks/useGetAllFeedbacks';
import sl from '../../../../../../core/di/InjectionContainer';
import { Feedback } from '../../../../../../domain/entities/booking/Feedback';

export const ReviewsSection: React.FC = () => {
    const getAllFeedbacksUseCase = useMemo(
        () => sl.get<GetAllFeedbacksUseCase>("GetAllFeedbacksUseCase"),
        []
    );

    const { feedbacks, loading, error } = useGetAllFeedbacks(getAllFeedbacksUseCase);

    const mapFeedbackToReview = (feedback: Feedback) => {
        return {
            content: feedback.comment || "Khách hàng hài lòng với dịch vụ.",
            author: feedback.renterName || "Khách hàng eMotoRent",
            rating: feedback.rating,
        };
    };

    if (loading) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đánh giá</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7C4DFF" />
                    <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
                </View>
            </View>
        );
    }

    // ✅ UPDATED: Both error and empty states show "Không có đánh giá nào"
    if (error || feedbacks.length === 0) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đánh giá</Text>
                <View style={styles.emptyContainer}>
                    {/* ✅ UPDATED: Icon instead of emoji */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="chatbox-ellipses-outline" size={48} color="#7C4DFF" />
                    </View>
                    <Text style={styles.emptyText}>Không có đánh giá nào</Text>
                    <Text style={styles.emptySubtext}>
                        Hãy là người đầu tiên đánh giá dịch vụ của chúng tôi!
                    </Text>
                </View>
            </View>
        );
    }

    const reviews = feedbacks.map(mapFeedbackToReview);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {reviews.map((review, index) => (
                    <ReviewCard key={feedbacks[index]?.id || index} {...review} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    scrollContent: {
        paddingRight: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#999',
        fontSize: 14,
        marginTop: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    // ✅ NEW: Container for icon with background
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(124, 77, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    emptySubtext: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
    },
});