import React from "react";
import { StyleSheet, View } from "react-native";
import { parseColorString, isLightColor } from "../../../../common/utils/colorUtils";

interface ColorWheelProps {
    color: string; // Vietnamese color name(s) - e.g., "Trắng Ngọc Trai, Đen Nhám, Lavender Sữa, Vàng"
    maxColors?: number; // Maximum colors to show (default: 4)
}

export const ColorWheel: React.FC<ColorWheelProps> = ({ color, maxColors = 4 }) => {
    // ✅ DEBUG: Log what we're receiving
    console.log('🎨 [ColorWheel] Received color string:', color);
    
    // Parse all colors from the string
    const colors = parseColorString(color).slice(0, maxColors);
    
    // ✅ DEBUG: Log parsed colors
    console.log('🎨 [ColorWheel] Parsed colors:', colors);
    console.log('🎨 [ColorWheel] Number of colors:', colors.length);

    // If only 1 color, show a single badge
    if (colors.length === 1) {
        const needsBorder = isLightColor(colors[0].hex);
        return (
            <View style={[
                styles.singleBadge,
                { backgroundColor: colors[0].hex },
                needsBorder && styles.lightBorder
            ]} />
        );
    }

    // Multiple colors - stack them with offset
    return (
        <View style={styles.wheelContainer}>
            {colors.map((colorInfo, index) => {
                const needsBorder = isLightColor(colorInfo.hex);
                const offset = index * 8; // 8px offset for each color
                
                return (
                    <View
                        key={index}
                        style={[
                            styles.colorDot,
                            {
                                backgroundColor: colorInfo.hex,
                                left: offset,
                                zIndex: colors.length - index, // Stack from back to front
                            },
                            needsBorder && styles.lightBorder
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    // Single color badge
    singleBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    // Multiple colors container
    wheelContainer: {
        position: "relative",
        width: 56, // Accommodate 4 colors with 8px offset: 32 + (3 * 8)
        height: 32,
    },
    // Individual color dot in the wheel
    colorDot: {
        position: "absolute",
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#1a1a1a", // Dark border to separate colors
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    // Light color border (for white/light colors)
    lightBorder: {
        borderWidth: 2.5,
        borderColor: "rgba(0, 0, 0, 0.2)",
    },
});