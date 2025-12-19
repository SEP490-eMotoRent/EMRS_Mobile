import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { TicketStatusDisplay } from "../../../../../../domain/entities/operations/tickets/TicketEnums";
import { BackButton } from "../../../../../common/components";
import { TripStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useGetTicketDetail } from "../../../hooks/Ticket/useGetTicketDetail";
import { container } from "../../../../../../core/di/ServiceContainer";
import { Icon } from "../../atoms";

type RoutePropType = RouteProp<TripStackParamList, "TicketDetail">;
type NavigationPropType = StackNavigationProp<TripStackParamList, "TicketDetail">;

const getStatusColor = (status: string): string => {
    switch (status) {
        case "Pending":
            return "#f59e0b";
        case "InProgress":
            return "#3b82f6";
        case "Resolved":
            return "#22c55e";
        default:
            return "#666";
    }
};

const getTicketTypeConfig = (ticketType: string) => {
    switch (ticketType) {
        case "WeakBattery":
            return { icon: 'battery-low' as const, color: '#f59e0b', label: 'Yếu pin' };
        case "FlatTyre":
            return { icon: 'tire-flat' as const, color: '#ef4444', label: 'Xẹp lốp' };
        case "UsageGuidance":
            return { icon: 'question-circle' as const, color: '#3b82f6', label: 'Hướng dẫn sử dụng' };
        case "OtherTechnical":
            return { icon: 'tools' as const, color: '#8b5cf6', label: 'Kỹ thuật khác' };
        default:
            return { icon: 'ticket' as const, color: '#666', label: 'Khác' };
    }
};

const getStatusMessage = (status: string): string => {
    switch (status) {
        case "Pending":
            return "Ticket của bạn đang chờ được xử lý. Nhân viên sẽ liên hệ sớm nhất có thể.";
        case "InProgress":
            return "Nhân viên đang xử lý sự cố của bạn. Vui lòng chờ thông báo tiếp theo.";
        case "Resolved":
            return "Sự cố đã được giải quyết. Cảm ơn bạn đã sử dụng dịch vụ.";
        default:
            return "";
    }
};

export const TicketDetailScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const { ticketId } = route.params;

    const { ticket, loading, error, refetch } = useGetTicketDetail(
        ticketId,
        container.support.tickets.getDetail
    );

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={handleBack} label="Quay lại" />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d4c5f9" />
                    <Text style={styles.loadingText}>Đang tải chi tiết ticket...</Text>
                </View>
            </View>
        );
    }

    if (error || !ticket) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={handleBack} label="Quay lại" />
                </View>
                <View style={styles.errorContainer}>
                    <Icon name="warning" size={48} color="#ef4444" />
                    <Text style={styles.errorText}>{error || "Không tìm thấy ticket"}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                        <Text style={styles.retryButtonText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const typeConfig = getTicketTypeConfig(ticket.ticketType);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={handleBack} label="Quay lại" />
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>Chi tiết ticket</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.statusCard,
                        { borderLeftColor: getStatusColor(ticket.status) },
                    ]}
                >
                    <View style={styles.statusHeader}>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: `${getStatusColor(ticket.status)}20` },
                            ]}
                        >
                            <View
                                style={[
                                    styles.statusDot,
                                    { backgroundColor: getStatusColor(ticket.status) },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: getStatusColor(ticket.status) },
                                ]}
                            >
                                {TicketStatusDisplay[ticket.status] || ticket.status}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.statusMessage}>
                        {getStatusMessage(ticket.status)}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loại sự cố</Text>
                    <View style={styles.typeCard}>
                        <View style={[
                            styles.typeIconContainer,
                            { backgroundColor: `${typeConfig.color}20` }
                        ]}>
                            <Icon 
                                name={typeConfig.icon} 
                                size={28} 
                                color={typeConfig.color} 
                            />
                        </View>
                        <Text style={styles.typeLabel}>{typeConfig.label}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tiêu đề</Text>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionText}>{ticket.description}</Text>
                    </View>
                </View>

                {ticket.attachments && ticket.attachments.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Ảnh đính kèm ({ticket.attachments.length})
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.attachmentScroll}
                        >
                            {ticket.attachments.map((attachment, index) => (
                                <View key={attachment.id || index} style={styles.attachmentItem}>
                                    <Image
                                        source={{ uri: attachment.fileUrl }}
                                        style={styles.attachmentImage}
                                        resizeMode="cover"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin</Text>
                    <View style={styles.metadataCard}>
                        <View style={styles.metadataRow}>
                            <View style={styles.metadataLabelContainer}>
                                <Icon name="ticket" size={16} color="#666" />
                                <Text style={styles.metadataLabel}>Mã ticket</Text>
                            </View>
                            <Text style={styles.metadataValue}>
                                #{ticket.id.slice(-8).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.metadataDivider} />
                        <View style={styles.metadataRow}>
                            <View style={styles.metadataLabelContainer}>
                                <Icon name="calendar" size={16} color="#666" />
                                <Text style={styles.metadataLabel}>Ngày tạo</Text>
                            </View>
                            <Text style={styles.metadataValue}>
                                {formatDate(ticket.createdAt)}
                            </Text>
                        </View>
                        {ticket.staffId && (
                            <>
                                <View style={styles.metadataDivider} />
                                <View style={styles.metadataRow}>
                                    <View style={styles.metadataLabelContainer}>
                                        <Icon name="checkmark" size={16} color="#666" />
                                        <Text style={styles.metadataLabel}>Nhân viên xử lý</Text>
                                    </View>
                                    <Text style={styles.metadataValue}>Đã được phân công</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    headerTextBlock: {
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#999",
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 16,
        textAlign: "center",
        marginTop: 16,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: "#d4c5f9",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#000",
        fontSize: 15,
        fontWeight: "600",
    },
    statusCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
    },
    statusHeader: {
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "700",
    },
    statusMessage: {
        color: "#999",
        fontSize: 14,
        lineHeight: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: "#666",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    typeCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    typeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    typeLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    ticketTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 24,
    },
    descriptionCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
    },
    descriptionText: {
        color: "#fff",
        fontSize: 15,
        lineHeight: 22,
    },
    attachmentScroll: {
        marginTop: 4,
    },
    attachmentItem: {
        marginRight: 12,
        borderRadius: 8,
        overflow: "hidden",
    },
    attachmentImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
    },
    metadataCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
    },
    metadataRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    metadataLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    metadataLabel: {
        color: "#666",
        fontSize: 14,
    },
    metadataValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "right",
        flex: 1,
        marginLeft: 12,
    },
    metadataDivider: {
        height: 1,
        backgroundColor: "#2a2a2a",
    },
    bottomSpacing: {
        height: 32,
    },
});