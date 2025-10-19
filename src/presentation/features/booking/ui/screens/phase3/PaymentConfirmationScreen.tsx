import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { HomeStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummaryCard } from "../../organisms/BookingSummaryCard";
import { CostBreakdown } from "../../organisms/CostBreakdown";
import { PaymentMethodCard } from "../../organisms/PaymentMethodCard";
import { PaymentNotices } from "../../organisms/PaymentNotices";


type PaymentConfirmationRouteProp = RouteProp<HomeStackParamList, 'PaymentConfirmation'>;
type PaymentConfirmationNavigationProp = StackNavigationProp<HomeStackParamList, 'PaymentConfirmation'>;

export const PaymentConfirmationScreen: React.FC = () => {
    const route = useRoute<PaymentConfirmationRouteProp>();
    const navigation = useNavigation<PaymentConfirmationNavigationProp>();
    
    const {
        vehicleId,
        startDate,
        endDate,
        duration,
        branchName,
        insurancePlan,
        rentalFee,
        insuranceFee,
        securityDeposit,
        serviceFee,
        total,
    } = route.params;

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wallet");

    console.log("Payment Confirmation - Vehicle ID:", vehicleId);

    const handleBack = () => {
        navigation.goBack();
    };

    const handlePayment = () => {
        console.log("Processing payment for vehicle:", vehicleId);
        console.log("Total amount:", total);
        
        const contractNumber = `CONTRACT-EMR-${Date.now()}`;
        
        navigation.navigate('DigitalContract', {
            vehicleId,
            vehicleName: "VinFast Evo200",
            startDate,
            endDate,
            duration,
            branchName,
            totalAmount: total,
            securityDeposit,
            contractNumber,
        });
    };
    
    // Parse total for wallet calculations
    const parsePrice = (price: string) => {
        return parseInt(price.replace(/[^0-9]/g, "")) || 0;
    };

    const totalAmount = parsePrice(total);
    const currentBalance = 5000000; // Mock wallet balance
    const afterBalance = currentBalance - totalAmount;
    const isSufficient = afterBalance >= 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <PageHeader title="Payment Confirmation" onBack={handleBack} />

            {/* Progress Indicator */}
            <ProgressIndicator currentStep={3} totalSteps={4} />

            {/* Scrollable Content */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Booking Summary */}
                <BookingSummaryCard
                    vehicleName="VinFast Evo200"
                    rentalPeriod={`${startDate} - ${endDate}`}
                    duration={duration}
                    branchName={branchName}
                    insurancePlan={insurancePlan}
                />

                {/* Payment Method Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionDivider} />
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.titleBackground}>
                                <View style={styles.sectionTitle} />
                            </View>
                        </View>
                    </View>
                    
                    <PaymentMethodCard
                        isSelected={selectedPaymentMethod === "wallet"}
                        onSelect={() => setSelectedPaymentMethod("wallet")}
                        currentBalance={`${currentBalance.toLocaleString()}đ`}
                        afterBalance={`${afterBalance.toLocaleString()}đ`}
                        isSufficient={isSufficient}
                    />
                </View>

                {/* Cost Breakdown */}
                <CostBreakdown
                    rentalFee={rentalFee}
                    insuranceFee={insuranceFee}
                    securityDeposit={securityDeposit}
                    serviceFee={serviceFee}
                    total={total}
                />

                {/* Payment Notices */}
                <PaymentNotices />
            </ScrollView>

            {/* Pay Button */}
            <View style={styles.footer}>
                <PrimaryButton 
                    title={`Pay ${total} with Wallet`} 
                    onPress={handlePayment}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        position: "relative",
        height: 1,
        marginBottom: 16,
    },
    sectionDivider: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: "#333",
    },
    sectionTitleContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: -10,
        alignItems: "flex-start",
        paddingLeft: 16,
    },
    titleBackground: {
        backgroundColor: "#000",
        paddingHorizontal: 8,
    },
    sectionTitle: {
        height: 20,
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
});