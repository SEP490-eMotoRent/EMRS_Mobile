import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PricingBreakdownProps {
    originalPricePerDay?: number;
    averagePricePerDay?: number;
    baseRentalFee?: number;
    rentalDays?: number;
    rentalHours?: number;
    configDiscount?: {
        percentage: number;
        amount: number;
        type: "monthly" | "yearly";
        appliesTo?: "all" | "partial";
    };
    membershipDiscount?: {
        percentage: number;
        amount: number;
        tier: string;
    };
    holidaySurcharge?: {
        amount: number;
        dayCount: number;
        holidays?: Array<{
            name: string;
            count: number;
            surchargePercentage: number;
            baseAfterDiscount: number;
            surchargeAmount: number;
            totalPricePerDay: number;
        }>;
    };
    rentalSubtotal: number;
    insuranceFee?: number;
    insuranceName?: string;
    securityDeposit: number;
    total: number;
    showDetailedBreakdown?: boolean;
}

export const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
    originalPricePerDay,
    averagePricePerDay,
    baseRentalFee,
    rentalDays,
    rentalHours,
    configDiscount,
    membershipDiscount,
    holidaySurcharge,
    rentalSubtotal,
    insuranceFee = 0,
    insuranceName,
    securityDeposit,
    total,
    showDetailedBreakdown = true,
}) => {
    const [isDiscountExpanded, setIsDiscountExpanded] = useState(false);
    const [isSurchargeExpanded, setIsSurchargeExpanded] = useState(false);
    
    const hasConfigDiscount = configDiscount && configDiscount.amount > 0;
    const hasMembershipDiscount = membershipDiscount && membershipDiscount.amount > 0;
    const hasHolidaySurcharge = holidaySurcharge && holidaySurcharge.amount > 0;
    const hasInsurance = insuranceFee > 0;
    
    const totalDiscount = (configDiscount?.amount || 0) + (membershipDiscount?.amount || 0);
    const totalSurcharge = holidaySurcharge?.amount || 0;
    const hasAnyDiscount = totalDiscount > 0;
    const hasAnySurcharge = totalSurcharge > 0;

    const getDiscountLabel = (type: "monthly" | "yearly"): string => {
        if (type === "monthly") return "Giảm giá thuê tháng";
        if (type === "yearly") return "Giảm giá thuê năm";
        return "Giảm giá";
    };

    const getMembershipTierLabel = (tier: string): string => {
        switch (tier.toUpperCase()) {
            case "BRONZE": return "Đồng";
            case "SILVER": return "Bạc";
            case "GOLD": return "Vàng";
            case "PLATINUM": return "Bạch Kim";
            case "DIAMOND": return "Kim Cương";
            default: return tier;
        }
    };

    const getEffectivePricePerDay = (originalPrice: number, discountPercentage: number): number => {
        return originalPrice * (1 - discountPercentage / 100);
    };

    const formatRentalDuration = (): string => {
        if (!rentalDays) return "";
        
        if (rentalHours && rentalHours > 0) {
            return `${rentalDays} ngày ${rentalHours} giờ`;
        }
        
        return `${rentalDays} ngày`;
    };

    const hasPriceDifference = originalPricePerDay && averagePricePerDay && 
        originalPricePerDay !== averagePricePerDay;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết thanh toán</Text>

            {showDetailedBreakdown && originalPricePerDay && averagePricePerDay && (
                <>
                    <View style={styles.pricePerDaySection}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Giá gốc mỗi ngày</Text>
                            <Text style={[
                                styles.value,
                                hasPriceDifference && styles.strikethroughValue
                            ]}>
                                {originalPricePerDay.toLocaleString()}đ/ngày
                            </Text>
                        </View>
                        
                        {hasPriceDifference && (
                            <View style={styles.row}>
                                <View style={styles.averageLabelRow}>
                                    <Text style={styles.averageLabel}>Giá trung bình</Text>
                                    {(averagePricePerDay < originalPricePerDay) && (
                                        <View style={styles.savingsBadge}>
                                            <Text style={styles.savingsBadgeText}>
                                                Tiết kiệm {Math.round(((originalPricePerDay - averagePricePerDay) / originalPricePerDay) * 100)}%
                                            </Text>
                                        </View>
                                    )}
                                    {(averagePricePerDay > originalPricePerDay) && (
                                        <View style={styles.surchargeBadge}>
                                            <Text style={styles.surchargeBadgeText}>
                                                +{Math.round(((averagePricePerDay - originalPricePerDay) / originalPricePerDay) * 100)}%
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[
                                    styles.averageValue,
                                    averagePricePerDay < originalPricePerDay && styles.averageValueDiscount,
                                    averagePricePerDay > originalPricePerDay && styles.averageValueSurcharge
                                ]}>
                                    {averagePricePerDay.toLocaleString()}đ/ngày
                                </Text>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.divider} />
                </>
            )}

            {showDetailedBreakdown && baseRentalFee && rentalDays && (
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Phí thuê gốc ({formatRentalDuration()})</Text>
                        <Text style={styles.baseValue}>
                            {baseRentalFee.toLocaleString()}đ
                        </Text>
                    </View>

                    {hasAnyDiscount && (
                        <View style={styles.collapsibleCard}>
                            <TouchableOpacity
                                onPress={() => setIsDiscountExpanded(!isDiscountExpanded)}
                                activeOpacity={0.7}
                                style={styles.collapsibleHeader}
                            >
                                <View style={styles.collapsibleHeaderLeft}>
                                    <Text style={styles.collapsibleIcon}>📉</Text>
                                    <Text style={styles.collapsibleTitle}>Giảm giá & Ưu đãi</Text>
                                </View>
                                <View style={styles.collapsibleHeaderRight}>
                                    <Text style={styles.discountAmount}>
                                        -{totalDiscount.toLocaleString()}đ
                                    </Text>
                                    <Text style={styles.toggleIcon}>
                                        {isDiscountExpanded ? '▲' : '▼'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            {isDiscountExpanded && (
                                <View style={styles.collapsibleContent}>
                                    {hasConfigDiscount && originalPricePerDay && (
                                        <View style={styles.detailItem}>
                                            <View style={styles.detailItemLeft}>
                                                <Text style={styles.detailItemTitle}>
                                                    • {getDiscountLabel(configDiscount.type)} ({configDiscount.percentage}%)
                                                </Text>
                                                {configDiscount.appliesTo === "all" && (
                                                    <Text style={styles.detailItemSubtitle}>
                                                        Áp dụng cho tất cả {rentalDays} ngày
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={styles.detailItemRight}>
                                                <Text style={styles.detailItemAmount}>
                                                    -{configDiscount.amount.toLocaleString()}đ
                                                </Text>
                                                <Text style={styles.effectivePriceText}>
                                                    Giá sau giảm: {Math.round(getEffectivePricePerDay(originalPricePerDay, configDiscount.percentage)).toLocaleString()}đ/ngày
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    
                                    <View style={styles.detailItem}>
                                        <Text style={[
                                            styles.detailItemTitle,
                                            !hasMembershipDiscount && styles.detailItemDisabled
                                        ]}>
                                            • Thành viên {getMembershipTierLabel(membershipDiscount?.tier || "BRONZE")} ({membershipDiscount?.percentage || 0}%)
                                        </Text>
                                        <Text style={[
                                            styles.detailItemAmount,
                                            !hasMembershipDiscount && styles.detailItemDisabled
                                        ]}>
                                            {hasMembershipDiscount ? `-${membershipDiscount.amount.toLocaleString()}đ` : '0đ'}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {hasAnySurcharge && (
                        <View style={styles.collapsibleCard}>
                            <TouchableOpacity
                                onPress={() => setIsSurchargeExpanded(!isSurchargeExpanded)}
                                activeOpacity={0.7}
                                style={styles.collapsibleHeader}
                            >
                                <View style={styles.collapsibleHeaderLeft}>
                                    <Text style={styles.collapsibleIcon}>📈</Text>
                                    <Text style={styles.collapsibleTitle}>Phụ thu</Text>
                                </View>
                                <View style={styles.collapsibleHeaderRight}>
                                    <Text style={styles.surchargeAmount}>
                                        +{totalSurcharge.toLocaleString()}đ
                                    </Text>
                                    <Text style={styles.toggleIcon}>
                                        {isSurchargeExpanded ? '▲' : '▼'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            {isSurchargeExpanded && holidaySurcharge && (
                                <View style={styles.collapsibleContent}>
                                    <View style={styles.surchargeMainItem}>
                                        <View style={styles.surchargeMainLeft}>
                                            <Text style={styles.surchargeMainTitle}>• Phụ thu ngày lễ</Text>
                                            <Text style={styles.surchargeMainSubtitle}>{holidaySurcharge.dayCount} ngày lễ</Text>
                                        </View>
                                        <Text style={styles.surchargeMainAmount}>
                                            +{holidaySurcharge.amount.toLocaleString()}đ
                                        </Text>
                                    </View>
                                    
                                    {holidaySurcharge.holidays && (
                                        <View style={styles.holidayDetailList}>
                                            {holidaySurcharge.holidays.map((holiday, index) => (
                                                <View key={index} style={styles.holidayDetailItem}>
                                                    <View style={styles.holidayDetailLeft}>
                                                        <Text style={styles.holidayDetailName}>
                                                            • {holiday.name} {holiday.count > 1 ? `(${holiday.count} ngày)` : ''}
                                                        </Text>
                                                        <Text style={styles.holidayDetailPercentage}>
                                                            Phụ thu {holiday.surchargePercentage}%
                                                        </Text>
                                                        <Text style={styles.holidayDetailFormula}>
                                                            {holiday.baseAfterDiscount.toLocaleString()}đ + {holiday.surchargeAmount.toLocaleString()}đ
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.holidayDetailPrice}>
                                                        {holiday.totalPricePerDay.toLocaleString()}đ/ngày
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.subtotalLabel}>Tổng phí thuê xe</Text>
                        <Text style={styles.subtotalValue}>
                            {rentalSubtotal.toLocaleString()}đ
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.row}>
                <Text style={styles.label}>
                    {insuranceName || "Phí bảo hiểm"}
                </Text>
                {hasInsurance ? (
                    <Text style={styles.value}>
                        {insuranceFee.toLocaleString()}đ
                    </Text>
                ) : (
                    <Text style={styles.freeValue}>MIỄN PHÍ</Text>
                )}
            </View>

            <View style={styles.row}>
                <View style={styles.depositLabelRow}>
                    <Text style={styles.label}>Tiền đặt cọc</Text>
                    <View style={styles.depositBadge}>
                        <Text style={styles.depositBadgeText}>Hoàn lại</Text>
                    </View>
                </View>
                <Text style={styles.value}>
                    {securityDeposit.toLocaleString()}đ
                </Text>
            </View>

            <View style={styles.thickDivider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalValue}>
                    {total.toLocaleString()}đ
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 16,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    pricePerDaySection: {
        marginBottom: 0,
    },
    averageLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    averageLabel: {
        color: "#999",
        fontSize: 14,
        fontWeight: "500",
    },
    averageValue: {
        fontSize: 15,
        fontWeight: "700",
    },
    averageValueDiscount: {
        color: "#22c55e",
    },
    averageValueSurcharge: {
        color: "#ef4444",
    },
    strikethroughValue: {
        textDecorationLine: "line-through",
        opacity: 0.5,
    },
    savingsBadge: {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    savingsBadgeText: {
        color: "#22c55e",
        fontSize: 10,
        fontWeight: "700",
    },
    surchargeBadge: {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    surchargeBadgeText: {
        color: "#ef4444",
        fontSize: 10,
        fontWeight: "700",
    },
    section: {
        marginBottom: 0,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        color: "#999",
        fontSize: 14,
    },
    baseValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    value: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    collapsibleCard: {
        backgroundColor: "#0f0f0f",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
    },
    collapsibleHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    collapsibleIcon: {
        fontSize: 14,
    },
    collapsibleTitle: {
        color: "#ccc",
        fontSize: 14,
        fontWeight: "600",
    },
    collapsibleHeaderRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    discountAmount: {
        color: "#22c55e",
        fontSize: 14,
        fontWeight: "700",
    },
    surchargeAmount: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "700",
    },
    toggleIcon: {
        color: "#999",
        fontSize: 10,
    },
    collapsibleContent: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: "#222",
    },
    detailItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 8,
        marginBottom: 8,
    },
    detailItemLeft: {
        flex: 1,
        marginRight: 12,
    },
    detailItemRight: {
        alignItems: "flex-end",
    },
    detailItemTitle: {
        color: "#22c55e",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 4,
    },
    detailItemSubtitle: {
        color: "#86efac",
        fontSize: 11,
        fontStyle: "italic",
    },
    effectivePriceText: {
        color: "#22c55e",
        fontSize: 10,
        fontWeight: "600",
        marginTop: 4,
    },
    detailItemAmount: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
    detailItemDisabled: {
        color: "#666",
    },
    surchargeMainItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 8,
        marginBottom: 8,
    },
    surchargeMainLeft: {
        flex: 1,
        marginRight: 12,
    },
    surchargeMainTitle: {
        color: "#ef4444",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 2,
    },
    surchargeMainSubtitle: {
        color: "#fca5a5",
        fontSize: 11,
    },
    surchargeMainAmount: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
    holidayDetailList: {
        marginTop: 4,
        paddingLeft: 12,
    },
    holidayDetailItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    holidayDetailLeft: {
        flex: 1,
        marginRight: 12,
    },
    holidayDetailName: {
        color: "#fca5a5",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 2,
    },
    holidayDetailPercentage: {
        color: "#fca5a5",
        fontSize: 10,
        opacity: 0.7,
    },
    holidayDetailFormula: {
        color: "#fca5a5",
        fontSize: 10,
        marginTop: 2,
        opacity: 0.8,
    },
    holidayDetailPrice: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
        textAlign: "right",
    },
    freeValue: {
        color: "#22c55e",
        fontSize: 14,
        fontWeight: "700",
    },
    depositLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    depositBadge: {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    depositBadgeText: {
        color: "#22c55e",
        fontSize: 10,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#333",
        marginVertical: 12,
    },
    thickDivider: {
        height: 2,
        backgroundColor: "#d4c5f9",
        marginVertical: 16,
        opacity: 0.3,
    },
    subtotalLabel: {
        color: "#d4c5f9",
        fontSize: 14,
        fontWeight: "600",
    },
    subtotalValue: {
        color: "#d4c5f9",
        fontSize: 15,
        fontWeight: "700",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    totalLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    totalValue: {
        color: "#00ff00",
        fontSize: 20,
        fontWeight: "700",
    },
});