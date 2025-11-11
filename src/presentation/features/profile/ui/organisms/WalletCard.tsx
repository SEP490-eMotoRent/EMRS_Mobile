import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Icon } from "../atoms/Icons/Icons";

interface WalletCardProps {
  balance: number | null;
  loading: boolean;
  error: string | null;
  onAddFunds: () => void;
  onWithdraw: () => void;
  onManage: () => void;
  onRetry?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  loading,
  error,
  onAddFunds,
  onWithdraw,
  onManage,
  onRetry,
}) => {
  // === RENDER LOADING STATE ===
  if (loading) {
    return (
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <View style={styles.walletTitle}>
            <Icon name="wallet" />
            <Text style={styles.walletTitleText}>Tiền trong ví</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c4b5fd" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  // === RENDER ERROR STATE ===
  if (error) {
    return (
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <View style={styles.walletTitle}>
            <Icon name="wallet" />
            <Text style={styles.walletTitleText}>Tiền trong ví</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // === RENDER SUCCESS STATE ===
  return (
    <View style={styles.walletCard}>
      <View style={styles.walletHeader}>
        <View style={styles.walletTitle}>
          <Icon name="wallet" />
          <Text style={styles.walletTitleText}>Tiền trong ví</Text>
        </View>
        <TouchableOpacity onPress={onManage}>
          <Text style={styles.manageText}>Quản Lý</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.availableText}>Số Dư</Text>
      <Text style={styles.balanceAmount}>
        {balance !== null ? balance.toLocaleString() : '0'}đ
      </Text>

      <View style={styles.walletActions}>
        <TouchableOpacity style={styles.addFundsButton} onPress={onAddFunds}>
          <Text style={styles.addFundsText}>+ Nạp tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onWithdraw}>
          <Text style={styles.withdrawText}>Rút Tiền</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  walletCard: {
    margin: 16,
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  walletTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walletTitleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  manageText: {
    color: "#999",
    fontSize: 14,
  },
  availableText: {
    color: "#999",
    fontSize: 13,
    marginBottom: 4,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  addFundsButton: {
    backgroundColor: "#c4b5fd",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFundsText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
  withdrawText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  // Loading state
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#999",
    fontSize: 14,
    marginTop: 12,
  },
  // Error state
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});