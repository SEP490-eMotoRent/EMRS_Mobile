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
                        {branches.map((branch) => {
                            const isAvailable = (branch.vehicleCount ?? 0) > 0;
                            const isSelected = branch.id === selectedBranchId;
                            
                            return (
                                <TouchableOpacity
                                    key={branch.id}
                                    style={[
                                        styles.dropdownItem,
                                        isSelected && styles.dropdownItemSelected,
                                        !isAvailable && styles.dropdownItemUnavailable, // ✅ NEW
                                    ]}
                                    onPress={() => {
                                        onBranchSelect(branch.id);
                                        setShowDropdown(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.dropdownItemHeader}>
                                        <Text style={[
                                            styles.dropdownItemText,
                                            isSelected && styles.dropdownItemTextSelected,
                                            !isAvailable && styles.dropdownItemTextUnavailable, // ✅ NEW
                                        ]}>
                                            {branch.name}
                                        </Text>
                                        {branch.vehicleCount !== undefined && (
                                            <View style={[
                                                styles.dropdownVehicleCount,
                                                !isAvailable && styles.dropdownVehicleCountUnavailable, // ✅ NEW
                                            ]}>
                                                <Text style={[
                                                    styles.dropdownVehicleCountText,
                                                    !isAvailable && styles.dropdownVehicleCountTextUnavailable, // ✅ NEW
                                                ]}>
                                                    {branch.vehicleCount} xe
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.dropdownItemAddress,
                                        !isAvailable && styles.dropdownItemAddressUnavailable, // ✅ NEW
                                    ]}>
                                        {branch.address}
                                    </Text>
                                    {/* ✅ NEW: Unavailable indicator */}
                                    {!isAvailable && (
                                        <Text style={styles.unavailableLabel}>
                                            Không có sẵn
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
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

            {/* ✅ UPDATED: Branch Info Card - Better styling */}
            <View style={styles.branchCard}>
                <View style={styles.branchHeader}>
                    <Text style={styles.branchName}>{selectedBranch.name}</Text>
                    {selectedBranch.vehicleCount !== undefined && (
                        <View style={[
                            styles.vehicleCountBadge,
                            (selectedBranch.vehicleCount ?? 0) === 0 && styles.vehicleCountBadgeUnavailable, // ✅ NEW
                        ]}>
                            <Text style={[
                                styles.vehicleCountText,
                                (selectedBranch.vehicleCount ?? 0) === 0 && styles.vehicleCountTextUnavailable, // ✅ NEW
                            ]}>
                                {selectedBranch.vehicleCount} xe
                            </Text>
                        </View>
                    )}
                </View>
                
                <BranchInfoItem icon="📍" text={selectedBranch.address} />
                <BranchInfoItem 
                    icon="🕒" 
                    text={`${selectedBranch.openingTime} - ${selectedBranch.closingTime}`} 
                />
                <BranchInfoItem icon="📞" text={selectedBranch.phone} />
                
                <View style={styles.badgeContainer}>
                    <AvailableBadge 
                        openingTime={selectedBranch.openingTime}
                        closingTime={selectedBranch.closingTime}
                    />
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
    // ✅ NEW: Unavailable item styling
    dropdownItemUnavailable: {
        opacity: 0.6,
    },
    dropdownItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    dropdownItemText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
    },
    dropdownItemTextSelected: {
        color: "#a78bfa",
    },
    // ✅ NEW: Unavailable text styling
    dropdownItemTextUnavailable: {
        color: "#666",
    },
    dropdownVehicleCount: {
        backgroundColor: "#333",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    // ✅ NEW: Unavailable badge styling
    dropdownVehicleCountUnavailable: {
        backgroundColor: "#2a2a2a",
        borderWidth: 1,
        borderColor: "#3a3a3a",
    },
    dropdownVehicleCountText: {
        color: "#22c55e",
        fontSize: 11,
        fontWeight: "600",
    },
    // ✅ NEW: Unavailable count text styling
    dropdownVehicleCountTextUnavailable: {
        color: "#666",
    },
    dropdownItemAddress: {
        color: "#999",
        fontSize: 12,
    },
    // ✅ NEW: Unavailable address styling
    dropdownItemAddressUnavailable: {
        color: "#555",
    },
    // ✅ NEW: Unavailable label
    unavailableLabel: {
        color: "#ff6b6b",
        fontSize: 11,
        fontWeight: "600",
        marginTop: 4,
        fontStyle: "italic",
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
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#222",
    },
    branchHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    branchName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        flex: 1,
    },
    vehicleCountBadge: {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(34, 197, 94, 0.3)",
    },
    // ✅ NEW: Unavailable badge styling in branch card
    vehicleCountBadgeUnavailable: {
        backgroundColor: "rgba(255, 107, 107, 0.15)",
        borderColor: "rgba(255, 107, 107, 0.3)",
    },
    vehicleCountText: {
        color: "#22c55e",
        fontSize: 13,
        fontWeight: "700",
    },
    // ✅ NEW: Unavailable text styling in branch card
    vehicleCountTextUnavailable: {
        color: "#ff6b6b",
    },
    badgeContainer: {
        marginTop: 12,
        alignSelf: "flex-start",
    },
    errorText: {
        color: "#FF4444",
        fontSize: 14,
        textAlign: "center",
        padding: 16,
    },
});