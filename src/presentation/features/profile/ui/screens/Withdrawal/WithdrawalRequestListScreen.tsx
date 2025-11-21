import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useWithdrawalRequests } from "../../../hooks/withdrawRequest/useWithdrawalRequests";
import { WithdrawalRequestCard } from "../../molecules/WithdrawalRequest/WithdrawalRequestCard";

type WithdrawalRequestListScreenNavigationProp = StackNavigationProp<ProfileStackParamList, "WithdrawalRequestList">;

interface WithdrawalRequestListScreenProps {
    navigation: WithdrawalRequestListScreenNavigationProp;
}

export const WithdrawalRequestListScreen: React.FC<WithdrawalRequestListScreenProps> = ({ navigation }) => {
    const { requests, loading, error, refresh } = useWithdrawalRequests();

    const handleRequestPress = (requestId: string) => {
        navigation.navigate("WithdrawalRequestDetail", { requestId });
    };

    if (loading && requests.length === 0) {
        return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Yêu cầu rút tiền</Text>
            <View style={styles.placeholder} />
            </View>
            <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#c4b5fd" />
            </View>
        </SafeAreaView>
        );
    }

    if (error && requests.length === 0) {
        return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Yêu cầu rút tiền</Text>
            <View style={styles.placeholder} />
            </View>
            <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        );
    }

    if (requests.length === 0) {
        return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Yêu cầu rút tiền</Text>
            <View style={styles.placeholder} />
            </View>
            <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Chưa có yêu cầu rút tiền nào</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateWithdrawalRequest")}>
                <Text style={styles.createButtonText}>Tạo yêu cầu</Text>
            </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Yêu cầu rút tiền</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CreateWithdrawalRequest")}>
            <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <WithdrawalRequestCard
                id={item.id}
                amount={item.amount}
                bankName={item.bankName}
                bankAccountNumber={item.bankAccountNumber}
                status={item.status as any}
                createdAt={item.createdAt}
                onPress={() => handleRequestPress(item.id)}
            />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#c4b5fd" colors={["#c4b5fd"]} />}
        />
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
    addButton: { padding: 8 },
    addText: { color: "#c4b5fd", fontSize: 28, fontWeight: "300" },
    listContent: { padding: 16 },
    centerContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    errorText: { color: "#ff4444", fontSize: 16, textAlign: "center", marginBottom: 16 },
    retryButton: { backgroundColor: "#333", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    retryText: { color: "#fff", fontSize: 14, fontWeight: "600" },
    emptyText: { color: "#999", fontSize: 16, textAlign: "center", marginBottom: 24 },
    createButton: { backgroundColor: "#c4b5fd", paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
    createButtonText: { color: "#000", fontSize: 16, fontWeight: "600" },
});