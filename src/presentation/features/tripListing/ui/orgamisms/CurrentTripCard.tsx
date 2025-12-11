import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBadge } from "../atoms/badges/StatusBadge";

export interface CurrentTrip {
    id: string;
    vehicleName: string;
    vehicleCategory?: string;
    vehicleImageUrl?: string;
    dates: string;
    duration?: string;
    status: "pending" | "booked" | "renting";
    timeInfo?: string;
    reference: string;
    location?: string;
    totalAmount?: string;
    depositAmount?: string;
    baseRentalFee?: string;
    hasInsurance?: boolean;
    vehicleAssigned?: boolean;
    hasAdditionalFees?: boolean;
    paymentExpiry?: string;
}

interface CurrentTripCardProps {
    trip: CurrentTrip;
    onViewDetails: () => void;
    onReportIssue?: () => void;
    onCancel?: () => void;
    onPayNow?: () => void;
    onExtend?: () => void;
}

export const CurrentTripCard: React.FC<CurrentTripCardProps> = ({
    trip,
    onViewDetails,
    onReportIssue,
    onCancel,
    onPayNow,
    onExtend,
}) => {
    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={onViewDetails}
            activeOpacity={0.7}
        >
            {/* Header with status and indicators */}
            <View style={styles.header}>
                <StatusBadge status={trip.status} />
                <View style={styles.indicators}>
                    {trip.hasInsurance && (
                        <View style={styles.insuranceIcon}>
                            <Icon name="shield-alt" size={14} color="#22c55e" solid />
                        </View>
                    )}
                    {trip.hasAdditionalFees && (
                        <View style={styles.feeBadge}>
                            <Text style={styles.feeBadgeText}>+Phí</Text>
                        </View>
                    )}
                </View>
            </View>
            
            {/* ✅ LARGE VEHICLE IMAGE - Full Width */}
            <View style={styles.imageContainer}>
                {trip.vehicleImageUrl ? (
                    <Image 
                        source={{ uri: trip.vehicleImageUrl }}
                        style={styles.vehicleImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon name="motorcycle" size={48} color="#666" />
                    </View>
                )}
                
                {/* Category Badge Overlay */}
                {trip.vehicleCategory && (
                    <View style={styles.categoryOverlay}>
                        <Text style={styles.categoryText}>{trip.vehicleCategory}</Text>
                    </View>
                )}
            </View>

            {/* ✅ Vehicle Info - Below Image */}
            <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName} numberOfLines={1}>
                    {trip.vehicleName}
                </Text>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Icon name="calendar" size={11} color="#999" solid />
                        <Text style={styles.metaText}>{trip.dates}</Text>
                    </View>
                    {trip.duration && (
                        <View style={styles.metaItem}>
                            <Icon name="clock" size={11} color="#999" solid />
                            <Text style={styles.metaText}>{trip.duration}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* PENDING: Payment expiry warning */}
            {trip.status === "pending" && trip.paymentExpiry && (
                <View style={styles.urgentAlert}>
                    <Icon name="clock" size={16} color="#fbbf24" solid />
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>Thanh toán trước {trip.paymentExpiry}</Text>
                        <Text style={styles.alertSubtext}>Đơn sẽ tự động hủy</Text>
                    </View>
                </View>
            )}

            {/* RENTING: Time info alert */}
            {trip.status === "renting" && trip.timeInfo && (
                <View style={styles.timeAlert}>
                    <Icon name="exclamation-triangle" size={14} color="#ef4444" solid />
                    <Text style={styles.alertText}>{trip.timeInfo}</Text>
                </View>
            )}

            {/* Reference */}
            <Text style={styles.reference}>Mã đơn: {trip.reference}</Text>
            
            {/* Amount section - for pending and booked */}
            {(trip.status === "pending" || trip.status === "booked") && (
                <View style={styles.amountSection}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Chi phí thuê</Text>
                        <Text style={styles.amountValue}>{trip.baseRentalFee}</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Đặt cọc</Text>
                        <Text style={styles.amountValue}>{trip.depositAmount}</Text>
                    </View>
                </View>
            )}
            
            {/* ✅ Actions - SINGLE ROW */}
            <View style={styles.actions}>
                {trip.status === "pending" && (
                    <>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={(e) => {
                                e.stopPropagation();
                                onPayNow?.();
                            }}
                        >
                            <Icon name="credit-card" size={14} color="#000" solid />
                            <Text style={styles.primaryButtonText}>Thanh toán</Text>
                        </TouchableOpacity>
                        {onCancel && (
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onCancel();
                                }}
                            >
                                <Icon name="times" size={14} color="#ef4444" solid />
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                {trip.status === "booked" && (
                    <>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={(e) => {
                                e.stopPropagation();
                                onViewDetails();
                            }}
                        >
                            <Icon name="file-alt" size={14} color="#000" solid />
                            <Text style={styles.primaryButtonText}>Chi tiết</Text>
                        </TouchableOpacity>
                        {onCancel && (
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onCancel();
                                }}
                            >
                                <Icon name="times" size={14} color="#ef4444" solid />
                                <Text style={styles.cancelButtonText}>Hủy đơn</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                {trip.status === "renting" && (
                    <>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={(e) => {
                                e.stopPropagation();
                                onViewDetails();
                            }}
                        >
                            <Icon name="file-alt" size={14} color="#000" solid />
                            <Text style={styles.primaryButtonText}>Chi tiết</Text>
                        </TouchableOpacity>
                        {onReportIssue && (
                            <TouchableOpacity 
                                style={styles.dangerButton} 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onReportIssue();
                                }}
                            >
                                <Icon name="exclamation-circle" size={14} color="#ef4444" solid />
                                <Text style={styles.dangerButtonText}>Sự cố</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0a0a0a",
        borderWidth: 1,
        borderColor: "#2a2a2a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    indicators: {
        flexDirection: "row",
        gap: 8,
    },
    insuranceIcon: {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    feeBadge: {
        backgroundColor: "rgba(251, 191, 36, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(251, 191, 36, 0.3)",
        justifyContent: "center",
    },
    feeBadgeText: {
        color: "#fbbf24",
        fontSize: 10,
        fontWeight: "700",
    },
    // ✅ NEW: Large Image Container
    imageContainer: {
        width: "100%",
        height: 160,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
        marginBottom: 12,
        position: "relative",
    },
    vehicleImage: {
        width: "100%",
        height: "100%",
    },
    placeholderImage: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    categoryOverlay: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    categoryText: {
        color: "#d4c5f9",
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    // ✅ NEW: Vehicle Info Below Image
    vehicleInfo: {
        marginBottom: 12,
    },
    vehicleName: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: "row",
        gap: 16,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    metaText: {
        color: "#999",
        fontSize: 12,
    },
    // Alerts
    urgentAlert: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(251, 191, 36, 0.3)",
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        color: "#fbbf24",
        fontSize: 13,
        fontWeight: "700",
    },
    alertSubtext: {
        color: "#fbbf24",
        fontSize: 11,
        opacity: 0.8,
        marginTop: 2,
    },
    timeAlert: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.2)",
    },
    alertText: {
        color: "#ef4444",
        fontSize: 13,
        fontWeight: "600",
    },
    reference: {
        color: "#666",
        fontSize: 11,
        marginBottom: 12,
    },
    amountSection: {
        paddingTop: 12,
        marginBottom: 12,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2a",
        gap: 8,
    },
    amountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    amountLabel: {
        color: "#999",
        fontSize: 13,
    },
    amountValue: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    // ✅ Actions - Single Row
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#d4c5f9",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
    },
    primaryButtonText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "700",
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.3)",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
    },
    cancelButtonText: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "700",
    },
    dangerButton: {
        flex: 1,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.3)",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
    },
    dangerButtonText: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "700",
    },
});