import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FormInput } from "../../atoms/FormInput";

interface WithdrawalFormProps {
    currentBalance: number;
    availableBalance: number;
    reservedBalance: number;
    onSubmit: (data: {
        amount: number;
        bankName: string;
        bankAccountNumber: string;
        bankAccountName: string;
    }) => Promise<void>;
    loading?: boolean;
}

export const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
    currentBalance,
    availableBalance,
    reservedBalance,
    onSubmit,
    loading = false,
}) => {
    const [amount, setAmount] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    const hasReserved = reservedBalance > 0;

    // Format number with thousand separators (dots)
    const formatNumber = (value: string): string => {
        // Remove all non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, "");
        
        if (!numericValue) return "";
        
        // Add thousand separators
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Get raw numeric value
    const getRawNumber = (formattedValue: string): number => {
        const numericString = formattedValue.replace(/\./g, "");
        return parseFloat(numericString) || 0;
    };

    const handleAmountChange = (text: string) => {
        const formatted = formatNumber(text);
        setAmount(formatted);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        const rawAmount = getRawNumber(amount);

        if (!amount || rawAmount <= 0) {
            newErrors.amount = "Vui lòng nhập số tiền hợp lệ";
        } else if (rawAmount > availableBalance) {
            // ✅ VALIDATE AGAINST AVAILABLE BALANCE
            newErrors.amount = hasReserved 
                ? `Số dư khả dụng không đủ (${availableBalance.toLocaleString('vi-VN')}đ)`
                : "Số dư không đủ";
        }

        if (!bankName.trim()) {
            newErrors.bankName = "Vui lòng nhập tên ngân hàng";
        }

        if (!accountNumber.trim()) {
            newErrors.accountNumber = "Vui lòng nhập số tài khoản";
        }

        if (!accountName.trim()) {
            newErrors.accountName = "Vui lòng nhập tên chủ tài khoản";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const rawAmount = getRawNumber(amount);

        Alert.alert(
            "Xác nhận rút tiền",
            `Bạn có chắc muốn rút ${rawAmount.toLocaleString('vi-VN')}đ?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        await onSubmit({
                            amount: rawAmount,
                            bankName: bankName.trim(),
                            bankAccountNumber: accountNumber.trim(),
                            bankAccountName: accountName.trim(),
                        });
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>
                    {hasReserved ? "Số dư khả dụng" : "Số dư hiện tại"}
                </Text>
                <Text style={styles.balanceAmount}>
                    {availableBalance.toLocaleString('vi-VN')}đ
                </Text>

                {/* ✅ SHOW RESERVED INFO */}
                {hasReserved && (
                    <View style={styles.reservedInfo}>
                        <View style={styles.reservedRow}>
                            <Text style={styles.reservedLabel}>Tổng số dư</Text>
                            <Text style={styles.reservedValue}>
                                {currentBalance.toLocaleString('vi-VN')}đ
                            </Text>
                        </View>
                        <View style={styles.reservedRow}>
                            <Text style={styles.reservedLabel}>Đang chờ rút</Text>
                            <Text style={styles.reservedValueHighlight}>
                                -{reservedBalance.toLocaleString('vi-VN')}đ
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <FormInput
                label="Số tiền muốn rút"
                placeholder="Nhập số tiền"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
                error={errors.amount}
                required
            />

            <FormInput
                label="Tên ngân hàng"
                placeholder="VD: Vietcombank, BIDV, Techcombank"
                value={bankName}
                onChangeText={setBankName}
                error={errors.bankName}
                required
            />

            <FormInput
                label="Số tài khoản"
                placeholder="Nhập số tài khoản ngân hàng"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
                error={errors.accountNumber}
                required
            />

            <FormInput
                label="Tên chủ tài khoản"
                placeholder="Nhập tên chủ tài khoản"
                value={accountName}
                onChangeText={setAccountName}
                error={errors.accountName}
                required
            />

            <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.submitText}>Tạo yêu cầu rút tiền</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.note}>
                💡 Yêu cầu sẽ được xử lý trong vòng 1-3 ngày làm việc
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    balanceCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: "center",
    },
    balanceLabel: {
        color: "#999",
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: "#c4b5fd",
        fontSize: 32,
        fontWeight: "700",
    },
    // Reserved balance info
    reservedInfo: {
        width: "100%",
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#333",
        gap: 8,
    },
    reservedRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    reservedLabel: {
        color: "#999",
        fontSize: 13,
    },
    reservedValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    reservedValueHighlight: {
        color: "#fbbf24",
        fontSize: 14,
        fontWeight: "600",
    },
    submitButton: {
        backgroundColor: "#c4b5fd",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    note: {
        color: "#999",
        fontSize: 13,
        textAlign: "center",
        marginTop: 16,
    },
});