import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ContractHeader } from "../../molecules/phase4/ContractHeader";
import { ContractInfoRow } from "../../molecules/phase4/ContractInfoRow";

interface ContractDetailsCardProps {
    contractNumber: string;
    vehicleName: string;
    rentalPeriod: string;
    duration: string;
    pickupLocation: string;
    totalAmount: string;
    securityDeposit: string;
    imageUrl?: string;
}

export const ContractDetailsCard: React.FC<ContractDetailsCardProps> = ({
    contractNumber,
    vehicleName,
    rentalPeriod,
    duration,
    pickupLocation,
    totalAmount,
    securityDeposit,
    imageUrl,
}) => {
    return (
        <View style={styles.container}>
            <ContractHeader contractNumber={contractNumber} />
            
            <View style={styles.vehicleSection}>
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                        <Text style={styles.placeholder}>Xe máy điện</Text>
                    )}
                </View>
                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{vehicleName}</Text>
                    <Text style={styles.rentalPeriod}>{rentalPeriod}</Text>
                    <Text style={styles.duration}>{duration}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
                <ContractInfoRow label="Địa điểm nhận xe" value={pickupLocation} />
                <ContractInfoRow label="Tổng tiền" value={totalAmount} highlight />
                <ContractInfoRow label="Tiền đặt cọc" value={securityDeposit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    vehicleSection: {
        flexDirection: "row",
        marginBottom: 16,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    placeholder: {
        fontSize: 32,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },
    rentalPeriod: {
        color: "#999",
        fontSize: 12,
        marginBottom: 2,
    },
    duration: {
        color: "#999",
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#333",
        marginBottom: 16,
    },
    infoSection: {
        gap: 4,
    },
});