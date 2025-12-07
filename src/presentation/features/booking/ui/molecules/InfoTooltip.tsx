import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface InfoTooltipProps {
    message: string;
    isVisible: boolean;
    onHide: () => void;
    autoHideDuration?: number; // Default: 1250ms
    fadeInDuration?: number; // Default: 300ms
    fadeOutDuration?: number; // Default: 200ms
}

/**
 * InfoTooltip - Molecule Component
 * 
 * A reusable animated tooltip that displays information and auto-hides.
 * Used for displaying helpful hints like cancellation policies.
 * 
 * @example
 * ```tsx
 * <InfoTooltip
 *   message="Hủy đặt xe trong vòng 24 giờ sẽ được hoàn 100% tiền đặt cọc."
 *   isVisible={showTooltip}
 *   onHide={() => setShowTooltip(false)}
 * />
 * ```
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({
    message,
    isVisible,
    onHide,
    autoHideDuration = 1250,
    fadeInDuration = 300,
    fadeOutDuration = 200,
}) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (isVisible) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: fadeInDuration,
                useNativeDriver: true,
            }).start();

            // Auto hide after specified duration
            const timer = setTimeout(() => {
                handleHide();
            }, autoHideDuration);

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleHide = () => {
        // Fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: fadeOutDuration,
            useNativeDriver: true,
        }).start(() => {
            onHide();
        });
    };

    if (!isVisible) return null;

    return (
        <Animated.View 
            style={[
                styles.tooltip,
                {
                    opacity: fadeAnim,
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0]
                        })
                    }]
                }
            ]}
        >
            <View style={styles.tooltipContent}>
                <Text style={styles.tooltipIcon}>ⓘ</Text>
                <Text style={styles.tooltipText}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    tooltip: {
        position: "absolute",
        bottom: "100%",
        left: 16,
        right: 16,
        marginBottom: 8,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#d4c5f9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
    tooltipContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    tooltipIcon: {
        fontSize: 16,
        color: "#d4c5f9",
        marginTop: 1,
    },
    tooltipText: {
        flex: 1,
        color: "#fff",
        fontSize: 13,
        lineHeight: 18,
    },
});