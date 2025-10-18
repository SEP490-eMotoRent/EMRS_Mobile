import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PricingCard } from "../molecules/PricingCard";

interface PricingOption {
    duration: string;
    price: string;
}

interface PricingSectionProps {
    pricingOptions: PricingOption[];
    securityDeposit: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
    pricingOptions, 
    securityDeposit 
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rental Pricing (VND)</Text>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pricingGrid}
            >
                {pricingOptions.map((option, index) => (
                    <PricingCard 
                        key={index}
                        duration={option.duration}
                        price={option.price}
                    />
                ))}
            </ScrollView>

            <View style={styles.depositContainer}>
                <Text style={styles.depositLabel}>Security Deposit</Text>
                <Text style={styles.depositAmount}>{securityDeposit}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    pricingGrid: {
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    depositContainer: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#333",
        marginHorizontal: 16,
    },
    depositLabel: {
        color: "#999",
        fontSize: 13,
        marginBottom: 6,
    },
    depositAmount: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});
