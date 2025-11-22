import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MembershipResponse } from "../../../../../data/models/account/renter/RenterResponse";
import { getMembershipTierConfig, MembershipBadge, MembershipTier } from "../atoms/Badges/MembershipBadge";

interface MembershipCardProps {
    membership: MembershipResponse | null;
    onPress?: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
    membership,
    onPress,
}) => {
    const tier = (membership?.tierName?.toUpperCase() || "BRONZE") as MembershipTier;
    const config = getMembershipTierConfig(tier);
    const discountPercentage = membership?.discountPercentage || 0;
    const description = membership?.description || "Hạng thành viên mới";

    return (
        <TouchableOpacity
            style={[styles.card, { borderColor: config.borderColor }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress}
        >
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Hạng Thành Viên</Text>
                    <MembershipBadge tier={tier} size="medium" />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.tierName, { color: config.textColor }]}>
                    {config.icon} {config.labelVi}
                </Text>
                <Text style={styles.description}>{description}</Text>

                {discountPercentage > 0 && (
                    <View style={styles.benefitRow}>
                        <View style={[styles.benefitBadge, { backgroundColor: config.backgroundColor }]}>
                            <Text style={[styles.benefitText, { color: config.textColor }]}>
                                Giảm {discountPercentage}% khi đặt xe
                            </Text>
                        </View>
                    </View>
                )}

                {discountPercentage === 0 && (
                    <View style={styles.upgradeHint}>
                        <Text style={styles.upgradeHintText}>
                            Đặt thêm xe để nâng hạng và nhận ưu đãi!
                        </Text>
                    </View>
                )}
            </View>

            {onPress && (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Xem chi tiết →</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        overflow: "hidden",
    },
    header: {
        padding: 16,
        paddingBottom: 12,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    tierName: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },
    description: {
        color: "#999",
        fontSize: 13,
        marginBottom: 12,
    },
    benefitRow: {
        flexDirection: "row",
    },
    benefitBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    benefitText: {
        fontSize: 13,
        fontWeight: "600",
    },
    upgradeHint: {
        backgroundColor: "#262626",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    upgradeHintText: {
        color: "#888",
        fontSize: 12,
        fontStyle: "italic",
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#333",
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    footerText: {
        color: "#666",
        fontSize: 13,
    },
});