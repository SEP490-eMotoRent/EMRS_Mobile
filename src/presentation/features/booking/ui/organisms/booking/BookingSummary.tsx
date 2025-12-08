import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InfoTooltip } from "../../molecules/InfoTooltip";
import { SummaryRow } from "../../atoms/text/SummaryRow";

interface BookingSummaryProps {
    rentalDuration: string; // "1 Ngày 8 Giờ" instead of rounded number
    rentalPrice: string;
    securityDeposit: string;
    total: string;
}

/**
 * BookingSummary - Organism Component
 * 
 * Displays rental cost breakdown with security deposit info tooltip.
 * Follows Atomic Design: Composes SummaryRow atoms and InfoTooltip molecule.
 */
export const BookingSummary: React.FC<BookingSummaryProps> = ({
    rentalDuration,
    rentalPrice,
    securityDeposit,
    total,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleShowTooltip = () => {
        setShowTooltip(true);
    };

    const handleHideTooltip = () => {
        setShowTooltip(false);
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
                    label={`Phí thuê (${rentalDuration})`} 
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

            {/* Tooltip using reusable InfoTooltip component */}
            <InfoTooltip
                message="Hủy đặt xe trong vòng 24 giờ sẽ được hoàn 100% tiền đặt cọc."
                isVisible={showTooltip}
                onHide={handleHideTooltip}
            />
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
        position: "relative",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        fontSize: 16,
        color: "#d4c5f9",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    content: {
        gap: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#2a2a2a",
        marginVertical: 8,
    },
});