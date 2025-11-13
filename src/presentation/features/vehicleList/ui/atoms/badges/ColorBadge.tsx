import React from "react";
import { StyleSheet, View } from "react-native";
import { getPrimaryColor, isLightColor } from "../../../../../common/utils/colorUtils";

interface ColorBadgeProps {
    color: string; // Vietnamese color name(s) - e.g., "Trắng Ngọc Trai, Đen Nhám"
}

export const ColorBadge: React.FC<ColorBadgeProps> = ({ color }) => {
    // Parse the color string and get the primary color
    const colorInfo = getPrimaryColor(color);
    const needsBorder = isLightColor(colorInfo.hex);

    return (
        <View style={[
            styles.badge,
            { backgroundColor: colorInfo.hex },
            needsBorder && styles.lightBorder
        ]} />
    );
};

const styles = StyleSheet.create({
    badge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    lightBorder: {
        borderWidth: 1.5,
        borderColor: "rgba(0, 0, 0, 0.15)",
    },
});