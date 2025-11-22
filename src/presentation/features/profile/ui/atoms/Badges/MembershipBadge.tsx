import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type MembershipTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

interface MembershipBadgeProps {
    tier: MembershipTier;
    size?: "small" | "medium" | "large";
    showLabel?: boolean;
}

const TIER_CONFIG: Record<MembershipTier, { 
    label: string; 
    labelVi: string;
    backgroundColor: string; 
    textColor: string;
    borderColor: string;
    icon: string;
}> = {
    BRONZE: {
        label: "Bronze",
        labelVi: "Đồng",
        backgroundColor: "#3d2a1a",
        textColor: "#cd7f32",
        borderColor: "#cd7f32",
        icon: "🥉",
    },
    SILVER: {
        label: "Silver",
        labelVi: "Bạc",
        backgroundColor: "#2a2a2a",
        textColor: "#c0c0c0",
        borderColor: "#c0c0c0",
        icon: "🥈",
    },
    GOLD: {
        label: "Gold",
        labelVi: "Vàng",
        backgroundColor: "#3d3520",
        textColor: "#ffd700",
        borderColor: "#ffd700",
        icon: "🥇",
    },
    PLATINUM: {
        label: "Platinum",
        labelVi: "Bạch Kim",
        backgroundColor: "#2a2d30",
        textColor: "#e5e4e2",
        borderColor: "#e5e4e2",
        icon: "💎",
    },
    DIAMOND: {
        label: "Diamond",
        labelVi: "Kim Cương",
        backgroundColor: "#1a2a3a",
        textColor: "#b9f2ff",
        borderColor: "#b9f2ff",
        icon: "👑",
    },
};

export const MembershipBadge: React.FC<MembershipBadgeProps> = ({
    tier,
    size = "medium",
    showLabel = true,
}) => {
    const config = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;

    const sizeStyles = {
        small: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontSize: 10,
            iconSize: 10,
        },
        medium: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            fontSize: 12,
            iconSize: 12,
        },
        large: {
            paddingHorizontal: 14,
            paddingVertical: 6,
            fontSize: 14,
            iconSize: 16,
        },
    };

    const currentSize = sizeStyles[size];

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: config.backgroundColor,
                    borderColor: config.borderColor,
                    paddingHorizontal: currentSize.paddingHorizontal,
                    paddingVertical: currentSize.paddingVertical,
                },
            ]}
        >
            <Text style={[styles.icon, { fontSize: currentSize.iconSize }]}>
                {config.icon}
            </Text>
            {showLabel && (
                <Text
                    style={[
                        styles.label,
                        {
                            color: config.textColor,
                            fontSize: currentSize.fontSize,
                        },
                    ]}
                >
                    {config.labelVi}
                </Text>
            )}
        </View>
    );
};

// Helper function to get tier config (for use in other components)
export const getMembershipTierConfig = (tier: MembershipTier) => {
    return TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    icon: {
        lineHeight: 16,
    },
    label: {
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});