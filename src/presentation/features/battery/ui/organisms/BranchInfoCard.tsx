import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Branch } from "../../../../../domain/entities/operations/Branch";
import { colors } from "../../../../common/theme/colors";

interface BranchInfoCardProps {
    branch: Branch;
    onClose: () => void;
    onNavigate: () => void;
    onShowRoute: () => void;
    isRouteVisible: boolean;
    hasUserLocation: boolean;
    distance?: string;
    duration?: string;
}

export const BranchInfoCard: React.FC<BranchInfoCardProps> = ({
    branch,
    onClose,
    onNavigate,
    onShowRoute,
    isRouteVisible,
    hasUserLocation,
    distance,
    duration,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <AntDesign name="close" size={20} color={colors.text.primary} />
            </TouchableOpacity>

            <Text style={styles.branchName}>{branch.branchName}</Text>

            <View style={styles.infoRow}>
                <AntDesign name="environment" size={14} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                    {branch.address}, {branch.city}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <AntDesign name="phone" size={14} color={colors.text.secondary} />
                <Text style={styles.infoText}>{branch.phone}</Text>
            </View>

            <View style={styles.infoRow}>
                <AntDesign name="clock-circle" size={14} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                    {branch.openingTime} - {branch.closingTime}
                </Text>
            </View>

            {/* Distance and Duration */}
            {distance && duration && (
                <View style={styles.routeInfoContainer}>
                    <View style={styles.routeInfoItem}>
                        <AntDesign name="car" size={14} color="#b8a4ff" />
                        <Text style={styles.routeInfoText}>{distance}</Text>
                    </View>
                    <View style={styles.routeInfoItem}>
                        <AntDesign name="clock-circle" size={14} color="#b8a4ff" />
                        <Text style={styles.routeInfoText}>{duration}</Text>
                    </View>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.routeButton,
                        isRouteVisible && styles.routeButtonActive,
                    ]}
                    onPress={onShowRoute}
                    disabled={!hasUserLocation}
                >
                    <AntDesign
                        name="eye"
                        size={16}
                        color={isRouteVisible ? "#000" : "#fff"}
                    />
                    <Text
                        style={[
                            styles.routeButtonText,
                            isRouteVisible && styles.routeButtonTextActive,
                        ]}
                    >
                        {isRouteVisible ? "Ẩn đường" : "Xem đường"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={onNavigate}
                    disabled={!hasUserLocation}
                >
                    <AntDesign name="arrow-right" size={16} color="#000" />
                    <Text style={styles.navigateButtonText}>Bắt đầu</Text>
                </TouchableOpacity>
            </View>

            {!hasUserLocation && (
                <Text style={styles.warningText}>
                    Cần quyền truy cập vị trí để chỉ đường
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#b8a4ff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    closeButton: {
        position: "absolute",
        top: 12,
        right: 12,
        padding: 4,
        zIndex: 10,
    },
    branchName: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 12,
        paddingRight: 32,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: colors.text.secondary,
        flex: 1,
    },
    routeInfoContainer: {
        flexDirection: "row",
        gap: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    routeInfoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    routeInfoText: {
        fontSize: 13,
        color: "#b8a4ff",
        fontWeight: "600",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
    },
    routeButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#2a2a2a",
        borderWidth: 1,
        borderColor: "#b8a4ff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    routeButtonActive: {
        backgroundColor: "#b8a4ff",
        borderColor: "#b8a4ff",
    },
    routeButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    routeButtonTextActive: {
        color: "#000",
    },
    navigateButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#b8a4ff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    navigateButtonText: {
        color: "#000",
        fontWeight: "600",
        fontSize: 14,
    },
    warningText: {
        fontSize: 11,
        color: "#ff6b6b",
        textAlign: "center",
        marginTop: 8,
    },
});