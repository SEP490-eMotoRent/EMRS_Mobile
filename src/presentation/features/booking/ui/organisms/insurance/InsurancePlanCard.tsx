import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { RadioButton } from "../../atoms/radio/RadioButton";
import { InsuranceBulletPoint } from "../../atoms/text/InsuranceBulletPoint";
import { InsurancePlanHeader } from "../../molecules/InsurancePlanHeader";

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

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({
    plan,
    isSelected,
    onSelect,
}) => {
    return (
        <TouchableOpacity 
            style={[styles.card, isSelected && styles.selectedCard]} 
            onPress={onSelect}
            activeOpacity={0.7}
        >
            <InsurancePlanHeader
                icon={plan.icon}
                iconColor={plan.iconColor}
                title={plan.title}
                price={plan.price}
                priceColor={plan.priceColor}
            />
            
            {plan.description && (
                <View style={styles.description}>
                    <InsuranceBulletPoint text={plan.description} />
                </View>
            )}
            
            <View style={styles.features}>
                {plan.features.map((feature, index) => (
                    <InsuranceBulletPoint key={index} text={feature} />
                ))}
            </View>
            
            <View style={styles.radioContainer}>
                <RadioButton selected={isSelected} />
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
        borderColor: "transparent",
    },
    selectedCard: {
        borderColor: "#d4c5f9",
    },
    description: {
        marginBottom: 12,
    },
    features: {
        marginBottom: 12,
    },
    radioContainer: {
        alignItems: "flex-start",
    },
});