import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SummaryRow } from "../../atoms/text/SummaryRow";

interface BookingSummaryProps {
    rentalDays: number;
    rentalPrice: string;
    securityDeposit: string;
    total: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
    rentalDays,
    rentalPrice,
    securityDeposit,
    total,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Auto-hide tooltip after 5 seconds
    useEffect(() => {
        if (showTooltip) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto hide after 5 seconds
            const timer = setTimeout(() => {
                handleHideTooltip();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    const handleShowTooltip = () => {
        setShowTooltip(true);
    };

    const handleHideTooltip = () => {
        // Fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowTooltip(false);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>◈</Text>
                </View>
                <Text style={styles.title}>Chi phí thuê xe</Text>
            </View>
            
            <View style={styles.content}>
                <SummaryRow 
                    label={`Phí thuê (${rentalDays} ngày)`} 
                    value={rentalPrice}
                />
                <SummaryRow 
                    label="Tiền đặt cọc" 
                    value={securityDeposit}
                    showInfo={true}
                    onInfoPress={handleShowTooltip}
                />
                <View style={styles.divider} />
                <SummaryRow 
                    label="Tổng cộng" 
                    value={total} 
                    isTotal 
                />
            </View>

            {/* Tooltip Popup */}
            {showTooltip && (
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
                        <Text style={styles.tooltipText}>
                            Tiền đặt cọc sẽ được hoàn trả trong vòng 7 ngày làm việc sau khi trả xe
                        </Text>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        position: "relative", // ✅ For tooltip positioning
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12, // ✅ Reduced from 20 to 12
        gap: 10,
    },
    iconContainer: {
        width: 32, // ✅ Reduced from 36 to 32
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        fontSize: 16, // ✅ Reduced from 18 to 16
        color: "#d4c5f9",
    },
    title: {
        color: "#fff",
        fontSize: 16, // ✅ Reduced from 18 to 16
        fontWeight: "700",
    },
    content: {
        gap: 4, // ✅ Reduced from 8 to 4
    },
    divider: {
        height: 1,
        backgroundColor: "#2a2a2a",
        marginVertical: 8,
    },
    // ✅ Tooltip popup styles
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