import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InsurancePriceBadge } from "../atoms/badges/InsurancePriceBadge";
import { InsuranceIcon } from "../atoms/icons/InsuranceIcon";

interface InsurancePlanHeaderProps {
    icon: string;
    iconColor: string;
    title: string;
    price: string;
    priceColor: string;
}

export const InsurancePlanHeader: React.FC<InsurancePlanHeaderProps> = ({
    icon,
    iconColor,
    title,
    price,
    priceColor,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <InsuranceIcon icon={icon} color={iconColor} />
                <Text style={styles.title}>{title}</Text>
            </View>
            <InsurancePriceBadge price={price} color={priceColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    title: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
});
