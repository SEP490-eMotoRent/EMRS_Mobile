import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { VehicleInfoHeader } from "../../molecules/VehicleInfoHeader";
import { InsuranceBookingSummary } from "../../organisms/InsuranceBookingSummary";
import { InsurancePlan, InsurancePlanCard } from "../../organisms/InsurancePlanCard";
import { useInsurancePackages } from "../../../hooks/useInsurancePackages";
import { formatVND, transformToInsurancePlan } from "../../../../../common/utils/insurancePackageFormatter";


type RoutePropType = RouteProp<BookingStackParamList, 'InsurancePlans'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'InsurancePlans'>;

// "No Protection" option (always available)
const noProtectionPlan: InsurancePlan = {
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
};

export const InsurancePlansScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    
    const { vehicleId, startDate, endDate, duration, rentalDays } = route.params;
    const [selectedPlanId, setSelectedPlanId] = useState<string>("none");

    // Fetch insurance packages from API
    const { packages, loading, error, refetch } = useInsurancePackages();

    console.log("Insurance Plans - Vehicle ID:", vehicleId);
    console.log("Rental Duration:", duration);
    console.log("Fetched Packages:", packages.length);

    // Transform API packages to UI format and prepend "No Protection"
    const insurancePlans: InsurancePlan[] = useMemo(() => {
        const apiPlans = packages.map(pkg => transformToInsurancePlan(pkg));
        return [noProtectionPlan, ...apiPlans];
    }, [packages]);

    const handleBack = () => {
        navigation.goBack();
    };

    const selectedPlan = insurancePlans.find(p => p.id === selectedPlanId);
    const selectedPackage = packages.find(p => p.id === selectedPlanId);
    
    const insuranceFee = selectedPlanId === "none" 
        ? "FREE" 
        : selectedPackage 
            ? formatVND(selectedPackage.packageFee)
            : "0đ";
    
    const rentalFee = "3,130,000đ"; // TODO: This should come from previous screen/API
    
    const parsePrice = (price: string) => {
        if (price === "FREE") return 0;
        return parseInt(price.replace(/[^0-9]/g, "")) || 0;
    };
    
    const totalAmount = parsePrice(rentalFee) + parsePrice(insuranceFee);
    const total = `${totalAmount.toLocaleString()}đ`;

    const handleContinue = () => {
        console.log("Selected insurance plan:", selectedPlanId);
        console.log("Selected package details:", selectedPackage);
        
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

    // Loading state
    if (loading) {
        return (
            <View style={styles.container}>
                <PageHeader title="Insurance Plans" onBack={handleBack} />
                <ProgressIndicator currentStep={2} totalSteps={4} />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading insurance packages...</Text>
                </View>
            </View>
        );
    }

    // Error state with retry
    if (error) {
        return (
            <View style={styles.container}>
                <PageHeader title="Insurance Plans" onBack={handleBack} />
                <ProgressIndicator currentStep={2} totalSteps={4} />
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <PrimaryButton 
                        title="Retry" 
                        onPress={refetch}
                        style={styles.retryButton}
                    />
                    <PrimaryButton 
                        title="Continue Without Insurance" 
                        onPress={() => {
                            setSelectedPlanId("none");
                            handleContinue();
                        }}
                        style={styles.skipButton}
                    />
                </View>
            </View>
        );
    }

    // Success state - display packages
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

                {insurancePlans.length === 1 && (
                    <Text style={styles.warningText}>
                        ⚠️ No insurance packages available at the moment. You can continue without protection.
                    </Text>
                )}

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
                <PrimaryButton 
                    title="Continue" 
                    onPress={handleContinue}
                    disabled={!selectedPlanId}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#000" 
    },
    scrollView: { 
        flex: 1 
    },
    content: { 
        padding: 16, 
        paddingBottom: 100 
    },
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
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    loadingText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 16,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    warningText: {
        color: "#fbbf24",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#44403c",
        borderRadius: 8,
    },
    retryButton: {
        marginTop: 16,
        minWidth: 200,
    },
    skipButton: {
        marginTop: 12,
        minWidth: 200,
        backgroundColor: "#374151",
    },
});