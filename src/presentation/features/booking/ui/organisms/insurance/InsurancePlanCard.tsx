import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RadioButton } from "../../atoms/radio/RadioButton";
import { InsuranceBulletPoint } from "../../atoms/text/InsuranceBulletPoint";

export interface InsurancePlan {
    id: string;
    icon: string;
    iconColor: string;
    title: string;
    price: string;
    priceColor: string;
    description: string;
    features: string[];
}

interface InsurancePlanCardProps {
    plan: InsurancePlan;
    isSelected: boolean;
    onSelect: () => void;
}

// ✅ Helper to remove duplicate consecutive features
const getUniqueFeatures = (features: string[]): string[] => {
    return features.filter((feature, index, array) => {
        if (index === 0) return true;
        return feature !== array[index - 1];
    });
};

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({
    plan,
    isSelected,
    onSelect,
}) => {
    const uniqueFeatures = getUniqueFeatures(plan.features);

    return (
        <TouchableOpacity 
            style={[styles.card, isSelected && styles.selectedCard]} 
            onPress={onSelect}
            activeOpacity={0.7}
        >
            {/* ✅ Complete header row: Radio + Icon + Title + Price */}
            <View style={styles.headerRow}>
                <RadioButton selected={isSelected} />
                
                <View style={styles.iconContainer}>
                    <Text style={[styles.icon, { color: plan.iconColor }]}>
                        {plan.icon}
                    </Text>
                </View>
                
                <Text style={styles.title} numberOfLines={1}>
                    {plan.title}
                </Text>
                
                <View style={[styles.priceBadge, { backgroundColor: plan.priceColor }]}>
                    <Text style={styles.priceText}>{plan.price}</Text>
                </View>
            </View>
            
            {plan.description && (
                <View style={styles.description}>
                    <InsuranceBulletPoint text={plan.description} />
                </View>
            )}
            
            {/* ✅ Only render unique features */}
            <View style={styles.features}>
                {uniqueFeatures.map((feature, index) => (
                    <InsuranceBulletPoint key={index} text={feature} />
                ))}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#2a2a2a",
    },
    selectedCard: {
        borderColor: "#d4c5f9",
        backgroundColor: "#0f0f1a",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        fontSize: 18,
    },
    title: {
        flex: 1, // ✅ Takes remaining space
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    priceBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    priceText: {
        color: "#000",
        fontSize: 13,
        fontWeight: "700",
    },
    description: {
        marginBottom: 12,
    },
    features: {
        gap: 8,
    },
});