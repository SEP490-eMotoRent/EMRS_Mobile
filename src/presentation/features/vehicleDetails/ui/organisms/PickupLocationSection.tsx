// presentation/features/vehicleDetails/ui/organisms/PickupLocationSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BranchUI } from "../../hooks/useVehicleBranches";
import { AvailableBadge } from "../atoms/badges/AvailableBadge";
import { SectionTitle } from "../atoms/text/SectionTitle";
import { BranchInfoItem } from "../molecules/BranchInfoItem";

interface PickupLocationSectionProps {
    branches: BranchUI[];
    branchesError: string | null;
    selectedBranchId: string | null;
    onBranchSelect: (branchId: string) => void;
}

export const PickupLocationSection: React.FC<PickupLocationSectionProps> = ({
    branches,
    branchesError,
    selectedBranchId,
    onBranchSelect,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    if (branchesError) {
        return (
            <View style={styles.container}>
                <SectionTitle title="Địa Điểm Nhận Xe" />
                <Text style={styles.errorText}>{branchesError}</Text>
            </View>
        );
    }

    if (branches.length === 0) {
        return (
            <View style={styles.container}>
                <SectionTitle title="Địa Điểm Nhận Xe" />
                <Text style={styles.errorText}>Hiện tại không có chi nhánh nào có xe này</Text>
            </View>
        );
    }

    const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

    return (
        <View style={styles.container}>
            <SectionTitle title="Chọn Địa Điểm Nhận Xe" />
            
            {/* Branch Selector Dropdown */}
            <View>
                <TouchableOpacity 
                    style={styles.addressSelector}
                    onPress={() => setShowDropdown(!showDropdown)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addressText}>{selectedBranch.address}</Text>
                    <Text style={styles.dropdownIcon}>{showDropdown ? "▲" : "▼"}</Text>
                </TouchableOpacity>

                {/* Dropdown List */}
                {showDropdown && (
                    <View style={styles.dropdownList}>
                        {branches.map((branch) => (
                            <TouchableOpacity
                                key={branch.id}
                                style={[
                                    styles.dropdownItem,
                                    branch.id === selectedBranchId && styles.dropdownItemSelected
                                ]}
                                onPress={() => {
                                    onBranchSelect(branch.id);
                                    setShowDropdown(false);
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.dropdownItemText,
                                    branch.id === selectedBranchId && styles.dropdownItemTextSelected
                                ]}>
                                    {branch.name}
                                </Text>
                                <Text style={styles.dropdownItemAddress}>{branch.address}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Map with Branch Location */}
            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        latitude: selectedBranch.latitude,
                        longitude: selectedBranch.longitude,
                        latitudeDelta: 0.0075,
                        longitudeDelta: 0.0075,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    <Marker
                        coordinate={{
                            latitude: selectedBranch.latitude,
                            longitude: selectedBranch.longitude,
                        }}
                        title={selectedBranch.name}
                        description={selectedBranch.address}
                        anchor={{ x: 0.5, y: 0.75 }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.markerBubble}>
                                <FontAwesome 
                                    name="motorcycle" 
                                    size={16} 
                                    color="#fff" 
                                />
                            </View>
                            <View style={styles.markerPointer} />
                        </View>
                    </Marker>
                </MapView>
            </View>

            {/* Branch Info Card */}
            <View style={styles.branchCard}>
                <View style={styles.branchHeader}>
                    <Text style={styles.branchName}>{selectedBranch.name}</Text>
                    {selectedBranch.vehicleCount !== undefined && (
                        <Text style={styles.distance}>{selectedBranch.vehicleCount} xe có sẵn</Text>
                    )}
                </View>
                
                <BranchInfoItem icon="📍" text={selectedBranch.address} />
                <BranchInfoItem 
                    icon="🕒" 
                    text={`${selectedBranch.openingTime} - ${selectedBranch.closingTime}`} 
                />
                <BranchInfoItem icon="📞" text={selectedBranch.phone} />
                
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
    dropdownList: {
        backgroundColor: "#000",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 16,
        overflow: "hidden",
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    dropdownItemSelected: {
        backgroundColor: "#1a1a1a",
    },
    dropdownItemText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    dropdownItemTextSelected: {
        color: "#a78bfa",
    },
    dropdownItemAddress: {
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
    map: {
        width: "100%",
        height: "100%",
    },
    markerContainer: {
        alignItems: "center",
    },
    markerBubble: {
        backgroundColor: "#000",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerPointer: {
        marginTop: -4,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
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
    errorText: {
        color: "#FF4444",
        fontSize: 14,
        textAlign: "center",
        padding: 16,
    },
});