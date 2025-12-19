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
            date?: Date;
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
    const [isNormalDaysExpanded, setIsNormalDaysExpanded] = useState(false);
    const [isHolidayDaysExpanded, setIsHolidayDaysExpanded] = useState(false);
    
    const hasConfigDiscount = configDiscount && configDiscount.amount > 0;
    const hasMembershipDiscount = membershipDiscount && membershipDiscount.amount > 0;
    const hasHolidaySurcharge = holidaySurcharge && holidaySurcharge.amount > 0;
    const hasInsurance = insuranceFee > 0;
    
    const holidayDayCount = holidaySurcharge?.dayCount || 0;
    const normalDayCount = (rentalDays || 0) - holidayDayCount;
    
    // Calculate C = sum of all holiday day totals
    const holidayDaysTotal = holidaySurcharge?.holidays?.reduce((sum, h) => 
        sum + (h.totalPricePerDay * h.count), 0
    ) || 0;
    
    // Calculate B = rental subtotal - C
    const normalDaysTotal = rentalSubtotal - holidayDaysTotal;
    
    // Calculate effective price per day for normal days (after all discounts)
    const effectivePricePerNormalDay = normalDayCount > 0 
        ? Math.round(normalDaysTotal / normalDayCount)
        : 0;

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

    const formatRentalDuration = (days: number, hours?: number): string => {
        if (hours && hours > 0) {
            return `${days} ngày ${hours} giờ`;
        }
        return `${days} ngày`;
    };

    /**
     * Format date to Vietnamese display
     * Example: "1/5" for May 1st
     */
    const formatHolidayDate = (date?: Date): string => {
        if (!date) return "";
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    // Only show price comparison if there's an actual discount (average < original)
    const hasActualDiscount = originalPricePerDay && averagePricePerDay && 
        averagePricePerDay < originalPricePerDay;
    
    // Show surcharge indicator if average > original
    const hasSurcharge = originalPricePerDay && averagePricePerDay && 
        averagePricePerDay > originalPricePerDay;

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
                                hasActualDiscount && styles.strikethroughValue
                            ]}>
                                {originalPricePerDay.toLocaleString()}đ/ngày
                            </Text>
                        </View>
                        
                        {(hasActualDiscount || hasSurcharge) && (
                            <View style={styles.row}>
                                <View style={styles.averageLabelRow}>
                                    <Text style={styles.averageLabel}>Giá trung bình</Text>
                                    {hasActualDiscount && (
                                        <View style={styles.savingsBadge}>
                                            <Text style={styles.savingsBadgeText}>
                                                Tiết kiệm {Math.round(((originalPricePerDay - averagePricePerDay) / originalPricePerDay) * 100)}%
                                            </Text>
                                        </View>
                                    )}
                                    {hasSurcharge && (
                                        <View style={styles.surchargeBadge}>
                                            <Text style={styles.surchargeBadgeText}>
                                                +{Math.round(((averagePricePerDay - originalPricePerDay) / originalPricePerDay) * 100)}%
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[
                                    styles.averageValue,
                                    hasActualDiscount && styles.averageValueDiscount,
                                    hasSurcharge && styles.averageValueSurcharge
                                ]}>
                                    {averagePricePerDay.toLocaleString()}đ/ngày
                                </Text>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.divider} />
                </>
            )}

            {showDetailedBreakdown && rentalDays !== undefined && (
                <View style={styles.section}>
                    {/* B - Ngày thường */}
                    <View style={styles.collapsibleCard}>
                        <TouchableOpacity
                            onPress={() => setIsNormalDaysExpanded(!isNormalDaysExpanded)}
                            activeOpacity={0.7}
                            style={styles.collapsibleHeader}
                        >
                            <View style={styles.collapsibleHeaderLeft}>
                                <Text style={styles.collapsibleIcon}>📅</Text>
                                <Text style={styles.collapsibleTitle}>Ngày thường</Text>
                            </View>
                            <View style={styles.collapsibleHeaderRight}>
                                <Text style={styles.normalDaysAmount}>
                                    {normalDaysTotal.toLocaleString()}đ
                                </Text>
                                <Text style={styles.toggleIcon}>
                                    {isNormalDaysExpanded ? '▲' : '▼'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                        {isNormalDaysExpanded && (
                            <View style={styles.collapsibleContent}>
                                <View style={styles.mainRow}>
                                    <View style={styles.mainRowLeft}>
                                        <Text style={styles.mainRowTitle}>
                                            {(hasConfigDiscount || hasMembershipDiscount) ? 'Giá sau giảm giá' : 'Chi phí ngày thường'}
                                        </Text>
                                        <Text style={styles.mainRowSubtitle}>
                                            {effectivePricePerNormalDay.toLocaleString()}đ/ngày × {formatRentalDuration(normalDayCount, rentalHours)}
                                        </Text>
                                    </View>
                                    <Text style={styles.mainRowAmount}>
                                        {normalDaysTotal.toLocaleString()}đ
                                    </Text>
                                </View>

                                {(hasConfigDiscount || hasMembershipDiscount) && (
                                    <View style={styles.discountDetailsSection}>
                                        <Text style={styles.discountDetailsTitle}>Giảm giá đã áp dụng:</Text>
                                        
                                        {hasConfigDiscount && (
                                            <View style={styles.discountDetailRow}>
                                                <Text style={styles.discountDetailLabel}>
                                                    • {getDiscountLabel(configDiscount.type)}
                                                </Text>
                                                <Text style={styles.discountDetailValue}>
                                                    {configDiscount.percentage}%
                                                </Text>
                                            </View>
                                        )}
                                        
                                        {/* Always show membership */}
                                        <View style={styles.discountDetailRow}>
                                            <Text style={[
                                                styles.discountDetailLabel,
                                                !hasMembershipDiscount && styles.discountDetailDisabled
                                            ]}>
                                                • Thành viên {getMembershipTierLabel(membershipDiscount?.tier || "BRONZE")}
                                            </Text>
                                            <Text style={[
                                                styles.discountDetailValue,
                                                !hasMembershipDiscount && styles.discountDetailDisabled
                                            ]}>
                                                {membershipDiscount?.percentage || 0}%
                                            </Text>
                                        </View>

                                        {originalPricePerDay && (
                                            <Text style={styles.effectivePriceNote}>
                                                Giá sau giảm: {effectivePricePerNormalDay.toLocaleString()}đ/ngày
                                            </Text>
                                        )}
                                    </View>
                                )}

                                {!hasConfigDiscount && !hasMembershipDiscount && (
                                    <View style={styles.noDiscountNote}>
                                        <Text style={styles.noDiscountText}>
                                            Không có giảm giá áp dụng
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* C - Ngày lễ */}
                    {hasHolidaySurcharge && holidaySurcharge && (
                        <View style={styles.collapsibleCard}>
                            <TouchableOpacity
                                onPress={() => setIsHolidayDaysExpanded(!isHolidayDaysExpanded)}
                                activeOpacity={0.7}
                                style={styles.collapsibleHeader}
                            >
                                <View style={styles.collapsibleHeaderLeft}>
                                    <Text style={styles.collapsibleIcon}>🎉</Text>
                                    <Text style={styles.collapsibleTitle}>Ngày lễ</Text>
                                </View>
                                <View style={styles.collapsibleHeaderRight}>
                                    <Text style={styles.holidayDaysAmount}>
                                        {holidayDaysTotal.toLocaleString()}đ
                                    </Text>
                                    <Text style={styles.toggleIcon}>
                                        {isHolidayDaysExpanded ? '▲' : '▼'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            {isHolidayDaysExpanded && holidaySurcharge.holidays && (
                                <View style={styles.collapsibleContent}>
                                    <View style={styles.mainRow}>
                                        <Text style={styles.mainRowTitle}>Phụ thu ngày lễ</Text>
                                        <Text style={styles.mainRowAmount}>
                                            {holidayDaysTotal.toLocaleString()}đ
                                        </Text>
                                    </View>

                                    <Text style={styles.holidayCountText}>
                                        {holidayDayCount} ngày lễ
                                    </Text>

                                    <View style={styles.holidayDetailList}>
                                        {holidaySurcharge.holidays.map((holiday, index) => {
                                            const dateDisplay = formatHolidayDate(holiday.date);
                                            return (
                                                <View key={index} style={styles.holidayDetailItem}>
                                                    <View style={styles.holidayDetailLeft}>
                                                        <View style={styles.holidayNameRow}>
                                                            <Text style={styles.holidayDetailName}>
                                                                • {holiday.name}
                                                            </Text>
                                                            {dateDisplay && (
                                                                <View style={styles.holidayDateBadge}>
                                                                    <Text style={styles.holidayDateText}>
                                                                        {dateDisplay}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <Text style={styles.holidayDetailFormula}>
                                                            Phụ thu {holiday.surchargePercentage}% • {holiday.baseAfterDiscount.toLocaleString()}đ + {holiday.surchargeAmount.toLocaleString()}đ
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.holidayDetailPrice}>
                                                        {holiday.totalPricePerDay.toLocaleString()}đ/ngày
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* D = B + C */}
                    <View style={styles.row}>
                        <Text style={styles.subtotalLabel}>Tổng phí thuê xe</Text>
                        <Text style={styles.subtotalValue}>
                            {rentalSubtotal.toLocaleString()}đ
                        </Text>
                    </View>
                </View>
            )}

            {/* Insurance */}
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

            {/* Security Deposit */}
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

            {/* Total */}
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
        color: "#fff",
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
    normalDaysAmount: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    holidayDaysAmount: {
        color: "#fff",
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
    mainRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 8,
        marginBottom: 8,
    },
    mainRowLeft: {
        flex: 1,
        marginRight: 12,
    },
    mainRowTitle: {
        color: "#22c55e",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 4,
    },
    mainRowSubtitle: {
        color: "#86efac",
        fontSize: 11,
        fontStyle: "italic",
    },
    mainRowAmount: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
    discountDetailsSection: {
        backgroundColor: "#1a1a1a",
        borderRadius: 6,
        padding: 10,
        marginTop: 4,
    },
    discountDetailsTitle: {
        color: "#22c55e",
        fontSize: 11,
        fontWeight: "700",
        marginBottom: 6,
    },
    discountDetailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    discountDetailLabel: {
        color: "#86efac",
        fontSize: 11,
    },
    discountDetailValue: {
        color: "#86efac",
        fontSize: 11,
        fontWeight: "700",
    },
    discountDetailDisabled: {
        color: "#666",
    },
    effectivePriceNote: {
        color: "#22c55e",
        fontSize: 10,
        fontWeight: "600",
        marginTop: 6,
    },
    noDiscountNote: {
        backgroundColor: "#1a1a1a",
        borderRadius: 6,
        padding: 10,
        marginTop: 4,
    },
    noDiscountText: {
        color: "#666",
        fontSize: 11,
        fontStyle: "italic",
        textAlign: "center",
    },
    holidayCountText: {
        color: "#fca5a5",
        fontSize: 11,
        marginBottom: 8,
    },
    holidayDetailList: {
        marginTop: 4,
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
    holidayNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    holidayDetailName: {
        color: "#ef4444",
        fontSize: 12,
        fontWeight: "700",
    },
    holidayDateBadge: {
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    holidayDateText: {
        color: "#fca5a5",
        fontSize: 9,
        fontWeight: "700",
    },
    holidayDetailFormula: {
        color: "#fca5a5",
        fontSize: 10,
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