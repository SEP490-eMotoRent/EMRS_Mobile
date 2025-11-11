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
    icon: "🚫",
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
    
    const { 
        vehicleId, 
        vehicleName,
        vehicleImageUrl,
        branchId,
        branchName,
        pricePerDay,
        securityDeposit,
        startDate, 
        endDate, 
        duration, 
        rentalDays,
        rentalPrice 
    } = route.params;
    
    const [selectedPlanId, setSelectedPlanId] = useState<string>("none");

    const { packages, loading, error, refetch } = useInsurancePackages();

    console.log("=== Insurance Plans Screen ===");
    console.log("Vehicle ID:", vehicleId);
    console.log("Vehicle Name:", vehicleName);
    console.log("Branch:", branchName);
    console.log("Rental Duration:", duration);
    console.log("Rental Days:", rentalDays);
    console.log("Price Per Day:", pricePerDay);
    console.log("Rental Price (from previous screen):", rentalPrice);
    console.log("Security Deposit:", securityDeposit);

    const insurancePlans: InsurancePlan[] = useMemo(() => {
        const apiPlans = packages.map(pkg => transformToInsurancePlan(pkg));
        return [noProtectionPlan, ...apiPlans];
    }, [packages]);

    const handleBack = () => {
        navigation.goBack();
    };

    const selectedPlan = insurancePlans.find(p => p.id === selectedPlanId);
    const selectedPackage = packages.find(p => p.id === selectedPlanId);
    
    // Calculate insurance fee
    const insuranceFeeValue = selectedPlanId === "none" 
        ? 0
        : selectedPackage?.packageFee || 0;
    
    const insuranceFee = insuranceFeeValue === 0 
        ? "MIỄN PHÍ" 
        : formatVND(insuranceFeeValue);
    
    // Format all fees for display
    const rentalFee = `${rentalPrice.toLocaleString()}đ`;
    const depositFee = `${securityDeposit.toLocaleString()}đ`;
    
    // Calculate totals
    const subtotalForDisplay = rentalPrice + insuranceFeeValue;
    const fullTotalAmount = rentalPrice + insuranceFeeValue + securityDeposit;
    const fullTotal = `${fullTotalAmount.toLocaleString()}đ`;

    console.log("=== Calculation Breakdown ===");
    console.log("Rental Price (fee only):", rentalPrice);
    console.log("Insurance Fee:", insuranceFeeValue);
    console.log("Security Deposit:", securityDeposit);
    console.log("Subtotal (Rental + Insurance):", subtotalForDisplay);
    console.log("FULL TOTAL (incl. deposit):", fullTotalAmount);

    const handleContinue = () => {
        console.log("=== Navigating to PaymentConfirmation ===");
        console.log("Selected insurance plan:", selectedPlanId);
        console.log("Passing full total:", fullTotal);
        
        navigation.navigate('PaymentConfirmation', {
            vehicleId,
            vehicleName,
            vehicleImageUrl,
            branchId,
            branchName,
            pricePerDay,
            startDate,
            endDate,
            duration,
            rentalDays,
            insurancePlan: selectedPlan?.title || "Không bảo vệ",
            insurancePlanId: selectedPlanId,
            rentalFee: `${rentalPrice.toLocaleString()}đ`,
            insuranceFee: insuranceFeeValue === 0 ? "0đ" : `${insuranceFeeValue.toLocaleString()}đ`,
            securityDeposit: `${securityDeposit.toLocaleString()}đ`,
            total: fullTotal,
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
                    vehicleName={vehicleName}
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

                {/* Complete cost breakdown including deposit */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Chi tiết chi phí</Text>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí thuê xe</Text>
                        <Text style={styles.summaryValue}>{rentalFee}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí bảo hiểm</Text>
                        <Text style={styles.summaryValue}>{insuranceFee}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tiền đặt cọc</Text>
                        <Text style={styles.summaryValue}>{depositFee}</Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{fullTotal}</Text>
                    </View>
                    
                    <Text style={styles.depositNote}>
                        * Tiền đặt cọc sẽ được hoàn trả sau khi trả xe
                    </Text>
                </View>
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
    // New styles for complete summary
    summaryCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: "#333",
    },
    summaryTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    summaryLabel: {
        color: "#999",
        fontSize: 14,
    },
    summaryValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#333",
        marginVertical: 12,
    },
    totalLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    totalValue: {
        color: "#00ff00",
        fontSize: 18,
        fontWeight: "700",
    },
    depositNote: {
        color: "#666",
        fontSize: 12,
        fontStyle: "italic",
        marginTop: 8,
    },
});