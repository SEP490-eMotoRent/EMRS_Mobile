import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useWallet } from "../../../hooks/wallet/useWallet";
import { WithdrawalForm } from "../../organisms/WithdrawOrganism/WithdrawalForm";
import { useCreateWithdrawalRequest } from "../../../hooks/withdrawRequest/useCreateWithdrawalRequest";

type CreateWithdrawalRequestScreenNavigationProp = StackNavigationProp<ProfileStackParamList, "CreateWithdrawalRequest">;

interface CreateWithdrawalRequestScreenProps {
    navigation: CreateWithdrawalRequestScreenNavigationProp;
}

export const CreateWithdrawalRequestScreen: React.FC<CreateWithdrawalRequestScreenProps> = ({ navigation }) => {
    const { 
        balance, 
        availableBalance,
        reservedBalance,
        loading: walletLoading, 
        error: walletError, 
        createWallet 
    } = useWallet();
    const { createRequest, loading } = useCreateWithdrawalRequest();

    // ✅ CHECK IF WALLET EXISTS
    useEffect(() => {
        if (walletError && walletError.includes("Wallet not found")) {
            Alert.alert(
                "Ví chưa được tạo",
                "Bạn cần tạo ví trước khi rút tiền. Tạo ví ngay?",
                [
                    { text: "Hủy", onPress: () => navigation.goBack() },
                    {
                        text: "Tạo ví",
                        onPress: async () => {
                            try {
                                await createWallet();
                                Alert.alert("Thành công", "Ví đã được tạo!");
                            } catch (error) {
                                Alert.alert("Lỗi", "Không thể tạo ví");
                                navigation.goBack();
                            }
                        },
                    },
                ]
            );
        }
    }, [walletError]);

    const handleSubmit = async (data: { amount: number; bankName: string; bankAccountNumber: string; bankAccountName: string }) => {
        try {
            await createRequest(data.amount, data.bankName, data.bankAccountNumber, data.bankAccountName);
            Alert.alert("Thành công", "Yêu cầu rút tiền đã được tạo. Chúng tôi sẽ xử lý trong vòng 1-3 ngày làm việc.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể tạo yêu cầu rút tiền");
        }
    };

    // ✅ SHOW LOADING IF WALLET IS LOADING
    if (walletLoading) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Rút tiền</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#c4b5fd" />
                    <Text style={styles.loadingText}>Đang kiểm tra ví...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rút tiền</Text>
                <View style={styles.placeholder} />
            </View>
            
            {/* ✅ KEYBOARD AVOIDING VIEW - Automatically adjusts when keyboard appears */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <WithdrawalForm 
                        currentBalance={balance || 0}
                        availableBalance={availableBalance || 0}
                        reservedBalance={reservedBalance}
                        onSubmit={handleSubmit} 
                        loading={loading} 
                    />
                </ScrollView>
            </KeyboardAvoidingView>
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
    keyboardAvoid: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { color: "#999", marginTop: 12, fontSize: 14 },
});