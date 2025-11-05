import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { formatVND, transformToInsurancePlan } from "../../../../../common/utils/insurancePackageFormatter";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useInsurancePackages } from "../../../hooks/useInsurancePackages";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { VehicleInfoHeader } from "../../molecules/VehicleInfoHeader";
import { InsuranceBookingSummary } from "../../organisms/insurance/InsuranceBookingSummary";
import { InsurancePlan, InsurancePlanCard } from "../../organisms/insurance/InsurancePlanCard";

type RoutePropType = RouteProp<BookingStackParamList, 'InsurancePlans'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'InsurancePlans'>;

const noProtectionPlan: InsurancePlan = {
    id: "none",
    icon: "Không bảo vệ",
    iconColor: "#ef4444",
    title: "Không bảo vệ",
    price: "MIỄN PHÍ",
    priceColor: "#333",
    description: "Không bao gồm bảo hiểm cho xe hoặc người lái",
    features: [
        "Bạn sẽ chịu trách nhiệm cho mọi hư hỏng và thương tích xảy ra trong thời gian thuê xe.",
    ],
};

export const InsurancePlansScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    
    const { vehicleId, startDate, endDate, duration, rentalDays } = route.params;
    const [selectedPlanId, setSelectedPlanId] = useState<string>("none");

    const { packages, loading, error, refetch } = useInsurancePackages();

    console.log("Insurance Plans - Vehicle ID:", vehicleId);
    console.log("Rental Duration:", duration);
    console.log("Fetched Packages:", packages.length);

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
        ? "MIỄN PHÍ" 
        : selectedPackage 
            ? formatVND(selectedPackage.packageFee)
            : "0đ";
    
    const rentalFee = "3,130,000đ";
    
    const parsePrice = (price: string) => {
        if (price === "MIỄN PHÍ") return 0;
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
            branchName: "Quận 2, Chi nhánh eMotoRent",
            insurancePlan: selectedPlan?.title || "Không bảo vệ",
            insurancePlanId: selectedPlanId,
            rentalFee: "1,130,000đ",
            insuranceFee: insuranceFee === "MIỄN PHÍ" ? "0đ" : insuranceFee,
            securityDeposit: "2,000,000đ",
            serviceFee: "35,000đ",
            total: total,
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <PageHeader title="Gói bảo hiểm" onBack={handleBack} />
                <ProgressIndicator currentStep={2} totalSteps={4} />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Đang tải gói bảo hiểm...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <PageHeader title="Gói bảo hiểm" onBack={handleBack} />
                <ProgressIndicator currentStep={2} totalSteps={4} />
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <PrimaryButton 
                        title="Thử lại" 
                        onPress={refetch}
                        style={styles.retryButton}
                    />
                    <PrimaryButton 
                        title="Tiếp tục không bảo hiểm" 
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

    return (
        <View style={styles.container}>
            <PageHeader title="Gói bảo hiểm" onBack={handleBack} />
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

                <Text style={styles.sectionTitle}>Chọn gói bảo vệ</Text>

                {insurancePlans.length === 1 && (
                    <Text style={styles.warningText}>
                        Hiện tại không có gói bảo hiểm nào. Bạn có thể tiếp tục mà không cần bảo vệ.
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
                    title="Tiếp tục" 
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