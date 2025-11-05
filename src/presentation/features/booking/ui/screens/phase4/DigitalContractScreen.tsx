import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { ContractDetailsCard } from "../../organisms/contract/ContractDetailsCard";
import { ContractGenerationProgress } from "../../organisms/contract/ContractGenerationProgress";
import { NextStepsCard } from "../../organisms/NextStepsCard";
import { PaymentSuccessHeader } from "../../organisms/payment/PaymentSuccessHeader";

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
                <PaymentSuccessHeader amount={totalAmount} />

                {!contractGenerated && (
                    <ContractGenerationProgress onComplete={handleContractComplete} />
                )}

                {contractGenerated && (
                    <>
                        <ContractDetailsCard
                            contractNumber={contractNumber}
                            vehicleName={vehicleName}
                            rentalPeriod={`${startDate} - ${endDate}`}
                            duration={duration}
                            pickupLocation={branchName}
                            totalAmount={totalAmount}
                            securityDeposit={`${securityDeposit} (có thể hoàn lại)`}
                        />

                        <View style={styles.confirmationCard}>
                            <Text style={styles.confirmationTitle}>Đặt xe thành công!</Text>
                            <Text style={styles.confirmationText}>
                                Đơn đặt xe của bạn đã được tạo thành công. Bạn sẽ nhận được email xác nhận trong giây lát.
                            </Text>
                            <Text style={styles.bookingReference}>
                                Mã đặt xe: {contractNumber}
                            </Text>
                        </View>

                        <NextStepsCard />

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Thông tin quan trọng</Text>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Vui lòng đến chi nhánh trước 20 phút so với giờ đặt nhận xe
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Mang theo CCCD và giấy phép lái xe
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Tiền đặt cọc sẽ được hoàn lại trong vòng 7 ngày làm việc sau khi trả xe
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Bạn có thể xem chi tiết đặt xe trong mục "Chuyến đi"
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {contractGenerated && (
                <View style={styles.footer}>
                    <PrimaryButton
                        title="Xem những lần đặt xe"
                        onPress={handleViewBooking}
                    />
                    <PrimaryButton
                        title="Về trang chủ"
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