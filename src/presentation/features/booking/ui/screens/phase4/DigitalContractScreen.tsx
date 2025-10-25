import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { ContractDetailsCard } from "../../organisms/ContractDetailsCard";
import { ContractGenerationProgress } from "../../organisms/ContractGenerationProgress";
import { NextStepsCard } from "../../organisms/NextStepsCard";
import { PaymentSuccessHeader } from "../../organisms/PaymentSuccessHeader";

type RoutePropType = RouteProp<BookingStackParamList, 'DigitalContract'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'DigitalContract'>;

export const DigitalContractScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    
    const {
        vehicleId,
        vehicleName,
        startDate,
        endDate,
        duration,
        rentalDays,
        branchName,
        totalAmount,
        securityDeposit,
        contractNumber,
    } = route.params;

    const [contractGenerated, setContractGenerated] = useState(false);

    const handleContractComplete = () => {
        setContractGenerated(true);
    };

    const handleViewBooking = () => {
        console.log("View booking details:", contractNumber);
        // Navigate to Trips tab to see booking
        navigation.getParent()?.getParent()?.navigate('Trips');
    };

    const handleGoHome = () => {
        console.log("Go home");
        navigation.getParent()?.getParent()?.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <ProgressIndicator currentStep={4} totalSteps={4} />
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Payment Success Header */}
                <PaymentSuccessHeader amount={totalAmount} />

                {/* Contract Generation Progress */}
                {!contractGenerated && (
                    <ContractGenerationProgress onComplete={handleContractComplete} />
                )}

                {/* Booking Details (shown after generation) */}
                {contractGenerated && (
                    <>
                        <ContractDetailsCard
                            contractNumber={contractNumber}
                            vehicleName={vehicleName}
                            rentalPeriod={`${startDate} - ${endDate}`}
                            duration={duration}
                            pickupLocation={branchName}
                            totalAmount={totalAmount}
                            securityDeposit={`${securityDeposit} (refundable)`}
                        />

                        {/* Booking Confirmation Message */}
                        <View style={styles.confirmationCard}>
                            <Text style={styles.confirmationTitle}>🎉 Booking Confirmed!</Text>
                            <Text style={styles.confirmationText}>
                                Your booking has been successfully created. You will receive a confirmation email shortly.
                            </Text>
                            <Text style={styles.bookingReference}>
                                Booking Reference: {contractNumber}
                            </Text>
                        </View>

                        {/* Next Steps */}
                        <NextStepsCard />

                        {/* Important Information */}
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>📋 Important Information</Text>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Please arrive at the branch 15 minutes before your pickup time
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Bring your ID card and driving license
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Security deposit will be refunded within 3-5 business days after return
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    You can view your booking details in the "Trips" tab
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Action Buttons */}
            {contractGenerated && (
                <View style={styles.footer}>
                    <PrimaryButton 
                        title="View My Bookings" 
                        onPress={handleViewBooking}
                    />
                    <PrimaryButton 
                        title="Back to Home" 
                        onPress={handleGoHome}
                        style={styles.secondaryButton}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    progressContainer: { paddingTop: 50 },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    confirmationCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#22c55e",
    },
    confirmationTitle: {
        color: "#22c55e",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },
    confirmationText: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    bookingReference: {
        color: "#4169E1",
        fontSize: 14,
        fontWeight: "600",
    },
    infoCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    infoTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: "row",
        marginBottom: 12,
    },
    infoBullet: {
        color: "#4169E1",
        fontSize: 16,
        marginRight: 8,
        width: 20,
    },
    infoText: {
        color: "#999",
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    secondaryButton: {
        marginTop: 12,
        backgroundColor: "#1a1a1a",
    },
});