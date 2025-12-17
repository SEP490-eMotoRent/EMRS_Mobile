import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { 
    ActivityIndicator, 
    ScrollView, 
    StyleSheet, 
    Text,
    View 
} from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { formatVND, transformToInsurancePlan } from "../../../../../common/utils/insurancePackageFormatter";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useInsurancePackages } from "../../../hooks/useInsurancePackages";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { VehicleInfoHeader } from "../../molecules/VehicleInfoHeader";
import { InsurancePlan, InsurancePlanCard } from "../../organisms/insurance/InsurancePlanCard";
import { PricingBreakdown } from "../../organisms/booking/PricingBreakdown";
import { SafeAreaView } from "react-native-safe-area-context";

type RoutePropType = RouteProp<BookingStackParamList, 'InsurancePlans'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'InsurancePlans'>;

const noProtectionPlan: InsurancePlan = {
    id: "none",
    icon: "⊘",
    iconColor: "#ef4444",
    title: "Không bảo vệ",
    price: "MIỄN PHÍ",
    priceColor: "#666",
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
        
        // ISO strings for backend
        startDateISO,
        endDateISO,
        
        // Display strings for UI
        startDateDisplay,
        endDateDisplay,
        
        duration, 
        rentalDays,
        
        // Numbers for calculations
        rentalFeeAmount,
        baseRentalFee,
        rentingRate,
        averageRentalPrice,
        
        vehicleCategory,
        holidaySurcharge,
        holidayDayCount,
        membershipDiscountPercentage,
        membershipDiscountAmount,
        membershipTier,
    } = route.params;
    
    const [selectedPlanId, setSelectedPlanId] = useState<string>("none");

    const { packages, loading, error, refetch } = useInsurancePackages();

    const insurancePlans: InsurancePlan[] = useMemo(() => {
        const sortedPackages = [...packages].sort((a, b) => a.packageFee - b.packageFee);
        const apiPlans = sortedPackages.map(pkg => transformToInsurancePlan(pkg));
        return [noProtectionPlan, ...apiPlans];
    }, [packages]);

    const handleBack = () => {
        navigation.goBack();
    };

    const selectedPlan = insurancePlans.find(p => p.id === selectedPlanId);
    const selectedPackage = packages.find(p => p.id === selectedPlanId);
    
    const insuranceFeeValue = selectedPlanId === "none" 
        ? 0
        : selectedPackage?.packageFee || 0;
    
    const insuranceFee = insuranceFeeValue === 0 
        ? "MIỄN PHÍ" 
        : formatVND(insuranceFeeValue);
    
    const rentalFee = `${rentalFeeAmount.toLocaleString()}đ`;
    const depositFee = `${securityDeposit.toLocaleString()}đ`;
    
    const fullTotalAmount = rentalFeeAmount + insuranceFeeValue + securityDeposit;
    const fullTotal = `${fullTotalAmount.toLocaleString()}đ`;

    const handleContinue = () => {
        navigation.navigate('PaymentConfirmation', {
            vehicleId,
            vehicleName,
            vehicleImageUrl,
            branchId,
            branchName,
            pricePerDay,
            
            // Pass ISO strings for backend
            startDateISO,
            endDateISO,
            
            // Pass display strings for UI
            startDateDisplay,
            endDateDisplay,
            
            duration,
            rentalDays,
            insurancePlan: selectedPlan?.title || "Không bảo vệ",
            insurancePlanId: selectedPlanId,
            
            // Pass numbers for calculations
            rentalFeeAmount: rentalFeeAmount,
            insuranceFeeAmount: insuranceFeeValue,
            securityDepositAmount: securityDeposit,
            
            // Keep formatted strings for display
            rentalFee: `${rentalFeeAmount.toLocaleString()}đ`,
            insuranceFee: insuranceFeeValue === 0 ? "MIỄN PHÍ" : `${insuranceFeeValue.toLocaleString()}đ`,
            securityDeposit: `${securityDeposit.toLocaleString()}đ`,
            total: fullTotal,
            
            baseRentalFee,
            rentingRate,
            averageRentalPrice,
            vehicleCategory,
            holidaySurcharge,
            holidayDayCount,
            membershipDiscountPercentage,
            membershipDiscountAmount,
            membershipTier,
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
        <SafeAreaView style={styles.container}>
            <PageHeader title="Gói bảo hiểm" onBack={handleBack} />
            <ProgressIndicator currentStep={2} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <VehicleInfoHeader
                    vehicleName={vehicleName}
                    rentalPeriod={`${startDateDisplay} - ${endDateDisplay}`}
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

                {/* NEW: Unified PricingBreakdown Component (Simple Mode) */}
                <PricingBreakdown
                    // Rental subtotal (already calculated from previous screen)
                    rentalSubtotal={rentalFeeAmount}
                    
                    // Surcharges (pass from route params)
                    holidaySurcharge={holidaySurcharge > 0 ? {
                        amount: holidaySurcharge,
                        dayCount: holidayDayCount,
                    } : undefined}
                    
                    // Insurance
                    insuranceFee={insuranceFeeValue}
                    insuranceName={selectedPlan?.title}
                    
                    // Deposit
                    securityDeposit={securityDeposit}
                    
                    // Total
                    total={fullTotalAmount}
                    
                    // Simple breakdown (no base price shown)
                    showDetailedBreakdown={false}
                />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton 
                    title="Tiếp tục" 
                    onPress={handleContinue}
                    disabled={!selectedPlanId}
                />
            </View>
        </SafeAreaView>
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