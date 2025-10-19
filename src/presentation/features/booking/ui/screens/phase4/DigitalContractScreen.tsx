import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { HomeStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { ContractDetailsCard } from "../../organisms/ContractDetailsCard";
import { ContractGenerationProgress } from "../../organisms/ContractGenerationProgress";
import { NextStepsCard } from "../../organisms/NextStepsCard";
import { OTPVerification } from "../../organisms/OTPVerification";
import { PaymentSuccessHeader } from "../../organisms/PaymentSuccessHeader";
import { TermsAgreement } from "../../organisms/TermsAgreement";
import { TermsHighlights } from "../../organisms/TermsHighlights";


type DigitalContractRouteProp = RouteProp<HomeStackParamList, 'DigitalContract'>;
type DigitalContractNavigationProp = StackNavigationProp<HomeStackParamList, 'DigitalContract'>;

export const DigitalContractScreen: React.FC = () => {
    const route = useRoute<DigitalContractRouteProp>();
    const navigation = useNavigation<DigitalContractNavigationProp>();
    
    const {
        vehicleId,
        vehicleName,
        startDate,
        endDate,
        duration,
        branchName,
        totalAmount,
        securityDeposit,
        contractNumber,
    } = route.params;

    const [contractGenerated, setContractGenerated] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);

    const terms = [
        "RENTAL TERMS: Lessee agrees to rent the vehicle identified above for the period and at the rate indicated.",
        "CONDITION OF VEHICLE: Lessee acknowledges that the vehicle is in good condition. Lessee will return the vehicle in the same condition.",
    ];

    const handleContractComplete = () => {
        setContractGenerated(true);
    };

    const handleReadFullTerms = () => {
        console.log("Open full terms modal");
        // TODO: Open full terms modal or navigate to terms page
    };

    const handleResendOTP = () => {
        console.log("Resending OTP");
        // TODO: Call API to resend OTP
    };

    const handleSignContract = () => {
        console.log("Contract signed for vehicle:", vehicleId);
        // TODO: Navigate to success/home screen
        // navigation.navigate('BookingSuccess');
    };

    const handleCancelBooking = () => {
        console.log("Cancel booking");
        // TODO: Show confirmation dialog, then navigate back
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <ProgressIndicator currentStep={4} totalSteps={4} />
            </View>

            {/* Scrollable Content */}
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

                {/* Contract Details (shown after generation) */}
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

                        {/* Terms Highlights */}
                        <TermsHighlights
                            terms={terms}
                            onReadFullTerms={handleReadFullTerms}
                        />

                        {/* Terms Agreement Checkbox */}
                        <TermsAgreement
                            checked={termsAgreed}
                            onToggle={() => setTermsAgreed(!termsAgreed)}
                        />

                        {/* Next Steps */}
                        <NextStepsCard />

                        {/* OTP Verification */}
                        <OTPVerification
                            phoneNumber="***8901"
                            onResend={handleResendOTP}
                        />
                    </>
                )}
            </ScrollView>

            {/* Action Buttons */}
            {contractGenerated && (
                <View style={styles.footer}>
                    <PrimaryButton 
                        title="Sign Contract" 
                        onPress={handleSignContract}
                        style={{ opacity: termsAgreed ? 1 : 0.5 }}
                    />
                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={handleCancelBooking}
                    >
                        <Text style={styles.cancelText}>Cancel Booking</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    progressContainer: {
        paddingTop: 50,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    cancelButton: {
        alignItems: "center",
        paddingVertical: 12,
        marginTop: 12,
    },
    cancelText: {
        color: "#ef4444",
        fontSize: 15,
        fontWeight: "600",
    },
});