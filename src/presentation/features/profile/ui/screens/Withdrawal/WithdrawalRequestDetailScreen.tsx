// src/features/profile/ui/screens/Withdrawal/WithdrawalRequestDetailScreen.tsx
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useCancelWithdrawalRequest } from "../../../hooks/withdrawRequest/useCancelWithdrawalRequest";
import { useWithdrawalRequestDetail } from "../../../hooks/withdrawRequest/useWithdrawalRequestDetail";
import { StatusBadge } from "../../atoms/Badges/StatusBadge";
import { BankInfoDisplay } from "../../molecules/WithdrawalRequest/BankInfoDisplay";

type WithdrawalRequestDetailScreenNavigationProp = StackNavigationProp<ProfileStackParamList, "WithdrawalRequestDetail">;
type WithdrawalRequestDetailScreenRouteProp = RouteProp<ProfileStackParamList, "WithdrawalRequestDetail">;

interface WithdrawalRequestDetailScreenProps {
    navigation: WithdrawalRequestDetailScreenNavigationProp;
    route: WithdrawalRequestDetailScreenRouteProp;
}

export const WithdrawalRequestDetailScreen: React.FC<WithdrawalRequestDetailScreenProps> = ({ navigation, route }) => {
    const { requestId } = route.params;
    const { request, loading, error, refresh } = useWithdrawalRequestDetail(requestId);
    const { cancelRequest, loading: canceling } = useCancelWithdrawalRequest();

    const handleCancel = () => {
        Alert.alert("Xác nhận hủy", "Bạn có chắc muốn hủy yêu cầu này?", [
        { text: "Không", style: "cancel" },
        {
            text: "Hủy yêu cầu",
            style: "destructive",
            onPress: async () => {
            try {
                await cancelRequest(requestId);
                Alert.alert("Thành công", "Yêu cầu đã được hủy", [{ text: "OK", onPress: () => navigation.goBack() }]);
            } catch (error: any) {
                Alert.alert("Lỗi", error.message || "Không thể hủy yêu cầu");
            }
            },
        },
        ]);
    };

    if (loading) {
        return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
            <View style={styles.placeholder} />
            </View>
            <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#c4b5fd" />
            </View>
        </SafeAreaView>
        );
    }

    if (error || !request) {
        return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
            <View style={styles.placeholder} />
            </View>
            <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error || "Không tìm thấy yêu cầu"}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        );
    }

    const formattedDate = request.createdAt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const canCancel = request.isPending();

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
            <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Số tiền rút</Text>
            <Text style={styles.amountValue}>{request.amount.toLocaleString()}đ</Text>
            <View style={styles.statusContainer}>
                <StatusBadge status={request.status as any} />
            </View>
            </View>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>
            <BankInfoDisplay bankName={request.bankName} accountNumber={request.bankAccountNumber} accountName={request.bankAccountName} />
            </View>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin yêu cầu</Text>
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ngày tạo</Text>
                <Text style={styles.infoValue}>{formattedDate}</Text>
                </View>
                {request.processedAt && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ngày xử lý</Text>
                    <Text style={styles.infoValue}>{request.processedAt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</Text>
                </View>
                )}
                {request.rejectionReason && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Lý do từ chối</Text>
                    <Text style={[styles.infoValue, styles.rejectionReason]}>{request.rejectionReason}</Text>
                </View>
                )}
            </View>
            </View>
            {canCancel && (
            <TouchableOpacity style={[styles.cancelButton, canceling && styles.cancelButtonDisabled]} onPress={handleCancel} disabled={canceling}>
                {canceling ? <ActivityIndicator color="#fff" /> : <Text style={styles.cancelButtonText}>Hủy yêu cầu</Text>}
            </TouchableOpacity>
            )}
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#333" },
    backButton: { padding: 8 },
    backText: { color: "#fff", fontSize: 24 },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
    placeholder: { width: 40 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16 },
    amountCard: { backgroundColor: "#1a1a1a", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 24 },
    amountLabel: { color: "#999", fontSize: 14, marginBottom: 8 },
    amountValue: { color: "#fff", fontSize: 36, fontWeight: "700", marginBottom: 16 },
    statusContainer: { alignItems: "center" },
    section: { marginBottom: 24 },
    sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 12 },
    infoCard: { backgroundColor: "#1a1a1a", borderRadius: 12, padding: 16, gap: 12 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    infoLabel: { color: "#999", fontSize: 14, flex: 1 },
    infoValue: { color: "#fff", fontSize: 14, fontWeight: "500", flex: 1, textAlign: "right" },
    rejectionReason: { color: "#ff4444" },
    cancelButton: { backgroundColor: "#ff4444", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
    cancelButtonDisabled: { opacity: 0.5 },
    cancelButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    centerContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    errorText: { color: "#ff4444", fontSize: 16, textAlign: "center", marginBottom: 16 },
    retryButton: { backgroundColor: "#333", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    retryText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});