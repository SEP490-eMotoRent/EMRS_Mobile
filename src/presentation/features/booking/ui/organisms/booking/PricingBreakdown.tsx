import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PricingBreakdownProps {
    // Base rental calculation
    baseRentalFee?: number;
    rentalDays?: number;
    
    // Discounts (show as negative/savings)
    configDiscount?: {
        percentage: number;
        amount: number;
        type: "monthly" | "yearly" | "none";
    };
    membershipDiscount?: {
        percentage: number;
        amount: number;
        tier: string;
    };
    
    // Surcharges (show as positive/extra cost)
    holidaySurcharge?: {
        amount: number;
        dayCount: number;
    };
    
    // Rental subtotal
    rentalSubtotal: number;
    
    // Additional fees
    insuranceFee?: number;
    insuranceName?: string;
    securityDeposit: number;
    
    // Final total
    total: number;
    
    // Display mode
    showDetailedBreakdown?: boolean;
}

export const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
    baseRentalFee,
    rentalDays,
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
    const hasConfigDiscount = configDiscount && configDiscount.amount > 0;
    const hasMembershipDiscount = membershipDiscount && membershipDiscount.amount > 0;
    const hasHolidaySurcharge = holidaySurcharge && holidaySurcharge.amount > 0;
    const hasInsurance = insuranceFee > 0;

    const getDiscountLabel = (type: "monthly" | "yearly" | "none"): string => {
        if (type === "monthly") return "Giảm giá thuê tháng";
        if (type === "yearly") return "Giảm giá thuê năm";
        return "Giảm giá";
    };

    const getMembershipIcon = (tier: string): string => {
        switch (tier.toUpperCase()) {
            case "BRONZE": return "🥉";
            case "SILVER": return "🥈";
            case "GOLD": return "🥇";
            case "PLATINUM": return "💎";
            case "DIAMOND": return "👑";
            default: return "👤";
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết thanh toán</Text>

            {/* Base Rental Fee */}
            {showDetailedBreakdown && baseRentalFee && rentalDays && (
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Phí thuê gốc ({rentalDays} ngày)</Text>
                        <Text style={styles.baseValue}>
                            {baseRentalFee.toLocaleString()}đ
                        </Text>
                    </View>

                    {/* Config Discount (Monthly/Yearly) */}
                    {hasConfigDiscount && (
                        <View style={styles.indentedRow}>
                            <Text style={styles.discountLabel}>
                                ↳ {getDiscountLabel(configDiscount.type)} ({configDiscount.percentage}%)
                            </Text>
                            <Text style={styles.discountValue}>
                                -{configDiscount.amount.toLocaleString()}đ
                            </Text>
                        </View>
                    )}

                    {/* Membership Discount */}
                    {hasMembershipDiscount && (
                        <View style={styles.indentedRow}>
                            <View style={styles.membershipLabelRow}>
                                <Text style={styles.membershipIcon}>
                                    {getMembershipIcon(membershipDiscount.tier)}
                                </Text>
                                <Text style={styles.discountLabel}>
                                    Ưu đãi thành viên ({membershipDiscount.percentage}%)
                                </Text>
                            </View>
                            <Text style={styles.discountValue}>
                                -{membershipDiscount.amount.toLocaleString()}đ
                            </Text>
                        </View>
                    )}

                    {/* Holiday Surcharge */}
                    {hasHolidaySurcharge && (
                        <View style={styles.indentedRow}>
                            <Text style={styles.surchargeLabel}>
                                ↳ Phụ thu ngày lễ ({holidaySurcharge.dayCount} ngày)
                            </Text>
                            <Text style={styles.surchargeValue}>
                                +{holidaySurcharge.amount.toLocaleString()}đ
                            </Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* Rental Subtotal */}
                    <View style={styles.row}>
                        <Text style={styles.subtotalLabel}>Tổng phí thuê xe</Text>
                        <Text style={styles.subtotalValue}>
                            {rentalSubtotal.toLocaleString()}đ
                        </Text>
                    </View>
                </View>
            )}

            {/* Simple mode - just show rental total */}
            {!showDetailedBreakdown && (
                <View style={styles.row}>
                    <Text style={styles.label}>Phí thuê xe</Text>
                    <Text style={styles.value}>
                        {rentalSubtotal.toLocaleString()}đ
                    </Text>
                </View>
            )}

            {/* Holiday surcharge (if simple mode) */}
            {!showDetailedBreakdown && hasHolidaySurcharge && (
                <View style={styles.indentedRow}>
                    <Text style={styles.surchargeLabel}>
                        ↳ Bao gồm phụ thu lễ ({holidaySurcharge.dayCount} ngày)
                    </Text>
                    <Text style={styles.surchargeValue}>
                        +{holidaySurcharge.amount.toLocaleString()}đ
                    </Text>
                </View>
            )}

            {/* Insurance Fee */}
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

            {/* Final Total */}
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalValue}>
                    {total.toLocaleString()}đ
                </Text>
            </View>

            {/* Savings Summary */}
            {showDetailedBreakdown && (hasConfigDiscount || hasMembershipDiscount) && (
                <View style={styles.savingsSummary}>
                    <Text style={styles.savingsIcon}>💰</Text>
                    <Text style={styles.savingsText}>
                        Bạn tiết kiệm được{" "}
                        <Text style={styles.savingsAmount}>
                            {((configDiscount?.amount || 0) + (membershipDiscount?.amount || 0)).toLocaleString()}đ
                        </Text>
                    </Text>
                </View>
            )}
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
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
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
    indentedRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        marginLeft: 12,
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
    discountLabel: {
        color: "#86efac",
        fontSize: 13,
    },
    discountValue: {
        color: "#22c55e",
        fontSize: 13,
        fontWeight: "600",
    },
    surchargeLabel: {
        color: "#fca5a5",
        fontSize: 13,
    },
    surchargeValue: {
        color: "#ef4444",
        fontSize: 13,
        fontWeight: "600",
    },
    membershipLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    membershipIcon: {
        fontSize: 12,
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
    savingsSummary: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    savingsIcon: {
        fontSize: 16,
    },
    savingsText: {
        color: "#86efac",
        fontSize: 13,
        flex: 1,
    },
    savingsAmount: {
        color: "#22c55e",
        fontWeight: "700",
    },
});