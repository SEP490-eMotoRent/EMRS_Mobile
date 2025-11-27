import React, { useState, useMemo, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
} from 'react-native';
import { CreateFeedbackUseCase } from '../../../../../../domain/usecases/feedback/CreateFeedbackUseCase';
import { useCreateFeedback } from '../../../hooks/feedbacks/useCreateFeedback';
import sl from '../../../../../../core/di/InjectionContainer';
import { Feedback } from '../../../../../../domain/entities/booking/Feedback';

interface FeedbackModalProps {
    visible: boolean;
    onClose: () => void;
    bookingId: string;
    vehicleName: string;
    existingFeedback?: Feedback | null;
    renterName?: string;
    onSuccess?: (feedback?: Feedback) => void;
}

type ModalMode = 'view' | 'create' | 'edit';

const StarRatingDisplay: React.FC<{ rating: number; size?: 'small' | 'large' }> = ({ 
    rating, 
    size = 'large' 
}) => {
    const fontSize = size === 'large' ? 40 : 24;
    return (
        <View style={starStyles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Text 
                    key={star} 
                    style={[
                        { fontSize },
                        star <= rating ? starStyles.starFilled : starStyles.starEmpty
                    ]}
                >
                    {star <= rating ? "★" : "☆"}
                </Text>
            ))}
        </View>
    );
};

const StarRatingInput: React.FC<{
    rating: number;
    onRatingChange: (rating: number) => void;
    disabled?: boolean;
}> = ({ rating, onRatingChange, disabled }) => {
    return (
        <View style={starStyles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => !disabled && onRatingChange(star)}
                    disabled={disabled}
                    style={starStyles.starButton}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        starStyles.star,
                        star <= rating ? starStyles.starFilled : starStyles.starEmpty
                    ]}>
                        {star <= rating ? "★" : "☆"}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const starStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    starButton: {
        padding: 4,
    },
    star: {
        fontSize: 40,
    },
    starFilled: {
        color: '#fbbf24',
    },
    starEmpty: {
        color: '#444',
    },
});

const getRatingLabel = (rating: number): string => {
    switch (rating) {
        case 1: return "Rất tệ 😞";
        case 2: return "Tệ 😕";
        case 3: return "Bình thường 😐";
        case 4: return "Tốt 😊";
        case 5: return "Tuyệt vời 🤩";
        default: return "Chọn đánh giá của bạn";
    }
};

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    visible,
    onClose,
    bookingId,
    vehicleName,
    existingFeedback,
    renterName = "Bạn",
    onSuccess,
}) => {
    const [mode, setMode] = useState<ModalMode>('create');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const createFeedbackUseCase = useMemo(
        () => sl.get<CreateFeedbackUseCase>("CreateFeedbackUseCase"),
        []
    );

    const { createFeedback, loading, error, success, reset } = useCreateFeedback(createFeedbackUseCase);

    // Priority: existingFeedback.renterName (from GET) > renterName prop (from profile)
    const displayName = existingFeedback?.renterName || renterName;

    useEffect(() => {
        if (visible) {
            reset();
            if (existingFeedback) {
                setMode('view');
                setRating(existingFeedback.rating);
                setComment(existingFeedback.comment);
            } else {
                setMode('create');
                setRating(0);
                setComment('');
            }
        }
    }, [visible, existingFeedback]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    }, [success, onClose]);

    const handleSubmit = async () => {
        if (rating === 0) return;

        await createFeedback(
            {
                rating,
                comment: comment.trim(),
                bookingId,
            },
            (newFeedback) => {
                onSuccess?.(newFeedback);
            }
        );
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleCancelEdit = () => {
        if (existingFeedback) {
            setRating(existingFeedback.rating);
            setComment(existingFeedback.comment);
            setMode('view');
        } else {
            onClose();
        }
    };

    const getTitle = (): string => {
        switch (mode) {
            case 'view': return "Đánh giá của bạn";
            case 'edit': return "Chỉnh sửa đánh giá";
            case 'create': return "Đánh giá chuyến đi";
        }
    };

    const renderViewMode = () => (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>{getTitle()}</Text>
                <Text style={styles.vehicleName}>{vehicleName}</Text>
            </View>

            <View style={styles.authorSection}>
                <View style={styles.authorAvatar}>
                    <Text style={styles.authorAvatarText}>
                        {displayName.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.authorName}>{displayName}</Text>
            </View>

            <View style={styles.viewRatingSection}>
                <StarRatingDisplay rating={rating} size="large" />
                <Text style={styles.ratingLabelView}>{getRatingLabel(rating)}</Text>
            </View>

            {comment && comment.trim().length > 0 && (
                <View style={styles.viewCommentSection}>
                    <Text style={styles.viewCommentLabel}>Nhận xét</Text>
                    <View style={styles.viewCommentBox}>
                        <Text style={styles.viewCommentText}>{comment}</Text>
                    </View>
                </View>
            )}

            {existingFeedback?.createdAt && (
                <View style={styles.timestampSection}>
                    <Text style={styles.timestampLabel}>Đánh giá vào</Text>
                    <Text style={styles.timestampValue}>
                        {formatDate(new Date(existingFeedback.createdAt))}
                    </Text>
                </View>
            )}

            <View style={styles.viewActions}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                >
                    <Text style={styles.editButtonText}>✎ Chỉnh sửa</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    const renderEditMode = () => (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>{getTitle()}</Text>
                <Text style={styles.vehicleName}>{vehicleName}</Text>
            </View>

            <View style={styles.ratingSection}>
                <StarRatingInput
                    rating={rating}
                    onRatingChange={setRating}
                    disabled={loading}
                />
                <Text style={styles.ratingLabel}>
                    {getRatingLabel(rating)}
                </Text>
            </View>

            <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>Nhận xét (tùy chọn)</Text>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                    editable={!loading}
                    textAlignVertical="top"
                />
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {mode === 'edit' && (
                <View style={styles.editNotice}>
                    <Text style={styles.editNoticeIcon}>ℹ️</Text>
                    <Text style={styles.editNoticeText}>
                        Chức năng chỉnh sửa đang được phát triển
                    </Text>
                </View>
            )}

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>
                        {mode === 'edit' ? 'Hủy' : 'Đóng'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (rating === 0 || loading || mode === 'edit') && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={rating === 0 || loading || mode === 'edit'}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {mode === 'edit' ? 'Cập nhật' : 'Gửi đánh giá'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </>
    );

    const renderSuccessState = () => (
        <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Cảm ơn bạn!</Text>
            <Text style={styles.successMessage}>
                Đánh giá của bạn đã được gửi thành công
            </Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.handleBar} />

                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            {success 
                                ? renderSuccessState()
                                : mode === 'view'
                                    ? renderViewMode()
                                    : renderEditMode()
                            }
                        </ScrollView>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '85%',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#444',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    vehicleName: {
        color: '#999',
        fontSize: 14,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    authorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#d4c5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorAvatarText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    authorName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    viewRatingSection: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 20,
        backgroundColor: 'rgba(251, 191, 36, 0.08)',
        borderRadius: 16,
    },
    ratingLabelView: {
        color: '#fbbf24',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
    },
    viewCommentSection: {
        marginBottom: 20,
    },
    viewCommentLabel: {
        color: '#999',
        fontSize: 14,
        marginBottom: 8,
    },
    viewCommentBox: {
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: '#2a2a2a',
        borderRadius: 12,
        padding: 16,
    },
    viewCommentText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
    },
    timestampSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
        marginBottom: 20,
    },
    timestampLabel: {
        color: '#666',
        fontSize: 13,
    },
    timestampValue: {
        color: '#999',
        fontSize: 13,
    },
    viewActions: {
        flexDirection: 'row',
        gap: 12,
    },
    closeButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    editButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fbbf24',
        fontSize: 16,
        fontWeight: '600',
    },
    ratingSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    ratingLabel: {
        color: '#d4c5f9',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    commentSection: {
        marginBottom: 20,
    },
    commentLabel: {
        color: '#999',
        fontSize: 14,
        marginBottom: 8,
    },
    commentInput: {
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: '#2a2a2a',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 15,
        minHeight: 100,
    },
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
    },
    editNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    editNoticeIcon: {
        fontSize: 16,
    },
    editNoticeText: {
        color: '#fbbf24',
        fontSize: 13,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        flex: 2,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#d4c5f9',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#444',
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    successIcon: {
        fontSize: 64,
        color: '#22c55e',
        marginBottom: 16,
    },
    successTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    successMessage: {
        color: '#999',
        fontSize: 16,
    },
});