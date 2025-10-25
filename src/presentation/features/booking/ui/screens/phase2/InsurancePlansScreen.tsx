import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { VehicleInfoHeader } from "../../molecules/VehicleInfoHeader";
import { InsuranceBookingSummary } from "../../organisms/InsuranceBookingSummary";
import { InsurancePlan, InsurancePlanCard } from "../../organisms/InsurancePlanCard";

type RoutePropType = RouteProp<BookingStackParamList, 'InsurancePlans'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'InsurancePlans'>;

const insurancePlans: InsurancePlan[] = [
    {
        id: "none",
        icon: "🚫",
        iconColor: "#ef4444",
        title: "No Protection",
        price: "FREE",
        priceColor: "#333",
        description: "No Coverage For Vehicle Or Rider",
        features: [
            "You will be responsible for all damages and injuries that may occur during your rental period.",
        ],
    },
    {
        id: "basic",
        icon: "🛡️",
        iconColor: "#3b82f6",
        title: "Basic Protection",
        price: "50,000đ",
        priceColor: "#3b82f6",
        description: "",
        features: [
            "Personal injury: 150M VND/person",
            "Property damage: 50M VND/incident",
            "Vehicle damage: Not covered",
            "Deductible: 2,000,000đ",
        ],
    },
    {
        id: "standard",
        icon: "🟢",
        iconColor: "#22c55e",
        title: "Standard Protection",
        price: "150,000đ",
        priceColor: "#22c55e",
        description: "",
        features: [
            "Personal injury: 150M VND/person",
            "Property damage: 50M VND/incident",
            "Vehicle damage: 50% coverage",
            "Personal accident: 30M VND/person",
            "Deductible: 1,000,000đ",
        ],
    },
    {
        id: "premium",
        icon: "🟡",
        iconColor: "#eab308",
        title: "Premium Protection",
        price: "150,000đ",
        priceColor: "#d4c5f9",
        description: "",
        features: [
            "Personal injury: 150M VND/person",
            "Property damage: 50M VND/incident",
            "Comprehensive vehicle coverage: 90%",
            "Personal accident: 50M VND/person",
            "Replacement vehicle included",
            "Deductible: 500,000đ",
        ],
    },
];

export const InsurancePlansScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    
    const { vehicleId, startDate, endDate, duration, rentalDays } = route.params;
    const [selectedPlanId, setSelectedPlanId] = useState<string>("none");

    console.log("Insurance Plans - Vehicle ID:", vehicleId);
    console.log("Rental Duration:", duration);

    const handleBack = () => {
        navigation.goBack();
    };

    const selectedPlan = insurancePlans.find(p => p.id === selectedPlanId);
    const insuranceFee = selectedPlanId === "none" ? "FREE" : selectedPlan?.price || "0đ";
    const rentalFee = "3,130,000đ";
    
    const parsePrice = (price: string) => {
        if (price === "FREE") return 0;
        return parseInt(price.replace(/[^0-9]/g, "")) || 0;
    };
    
    const totalAmount = parsePrice(rentalFee) + parsePrice(insuranceFee);
    const total = `${totalAmount.toLocaleString()}đ`;

    const handleContinue = () => {
        console.log("Selected insurance plan:", selectedPlanId);
        
        const selectedPlan = insurancePlans.find(p => p.id === selectedPlanId);
        
        navigation.navigate('PaymentConfirmation', {
            vehicleId,
            startDate,
            endDate,
            duration,
            rentalDays,
            branchName: "District 2, eMotoRent Branch",
            insurancePlan: selectedPlan?.title || "No Protection",
            insurancePlanId: selectedPlanId,
            rentalFee: "1,130,000đ",
            insuranceFee: insuranceFee === "FREE" ? "0đ" : insuranceFee,
            securityDeposit: "2,000,000đ",
            serviceFee: "35,000đ",
            total: total,
        });
    };

    return (
        <View style={styles.container}>
            <PageHeader title="Insurance Plans" onBack={handleBack} />
            <ProgressIndicator currentStep={2} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <VehicleInfoHeader
                    vehicleName="VinFast Evo200"
                    rentalPeriod={`${startDate} - ${endDate}`}
                />

                <Text style={styles.sectionTitle}>Select Protection Plan</Text>

                {insurancePlans.map((plan) => (
                    <InsurancePlanCard
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlanId === plan.id}
                        onSelect={() => setSelectedPlanId(plan.id)}
                    />
                ))}

                <InsuranceBookingSummary
                    rentalFee={rentalFee}
                    insuranceFee={insuranceFee}
                    total={total}
                />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton title="Continue" onPress={handleContinue} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
});