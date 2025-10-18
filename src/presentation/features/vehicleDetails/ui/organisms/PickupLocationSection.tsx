import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AvailableBadge } from "../atoms/badges/AvailableBadge";
import { SectionTitle } from "../atoms/text/SectionTitle";
import { BranchInfoItem } from "../molecules/BranchInfoItem";

interface PickupLocationSectionProps {
    address: string;
    branchName: string;
    branchAddress: string;
    phone: string;
    mapImageUri: string;
}

export const PickupLocationSection: React.FC<PickupLocationSectionProps> = ({
    address,
    branchName,
    branchAddress,
    phone,
    mapImageUri,
}) => {
    return (
        <View style={styles.container}>
            <SectionTitle title="Pick-Up Location" />
            
            {/* Address Selector (Static for now) */}
            <View style={styles.addressSelector}>
                <Text style={styles.addressText}>{address}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
                <Image 
                    source={{ uri: mapImageUri }} 
                    style={styles.mapImage}
                />
            </View>

            {/* Branch Info Card */}
            <View style={styles.branchCard}>
                <View style={styles.branchHeader}>
                    <Text style={styles.branchName}>{branchName}</Text>
                    <Text style={styles.distance}>2.5 km away</Text>
                </View>
                
                <BranchInfoItem icon="📍" text={branchAddress} />
                <BranchInfoItem icon="🕒" text="Open 24/7" />
                <BranchInfoItem icon="📞" text={phone} />
                
                <View style={styles.badgeContainer}>
                    <AvailableBadge />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
    },
    addressSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 16,
    },
    addressText: {
        color: "#fff",
        fontSize: 14,
        flex: 1,
    },
    dropdownIcon: {
        color: "#999",
        fontSize: 12,
    },
    mapContainer: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#2a2a2a",
    },
    mapImage: {
        width: "100%",
        height: "100%",
    },
    branchCard: {
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 16,
    },
    branchHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    branchName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    distance: {
        color: "#999",
        fontSize: 12,
    },
    badgeContainer: {
        marginTop: 8,
        alignSelf: "flex-start",
    },
});