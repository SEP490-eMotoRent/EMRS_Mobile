import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RadioButton } from "../../atoms/radio/RadioButton";
import { WalletBalance } from "../../molecules/WalletBalance";

interface PaymentMethodCardProps {
    isSelected: boolean;
    onSelect: () => void;
    currentBalance: string;
    afterBalance: string;
    isSufficient: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
    isSelected,
    onSelect,
    currentBalance,
    afterBalance,
    isSufficient,
}) => {
    return (
        <TouchableOpacity 
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={onSelect}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.leftSection}>
                    <View style={styles.icon}>
                        <Text style={styles.iconText}>💳</Text>
                    </View>
                    <Text style={styles.title}>Ví eMotoRent</Text>
                </View>
                <RadioButton selected={isSelected} />
            </View>
            
            <WalletBalance
                currentBalance={currentBalance}
                afterBalance={afterBalance}
                isSufficient={isSufficient}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedCard: {
        borderColor: "#d4c5f9",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    iconText: {
        fontSize: 20,
    },
    title: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
});