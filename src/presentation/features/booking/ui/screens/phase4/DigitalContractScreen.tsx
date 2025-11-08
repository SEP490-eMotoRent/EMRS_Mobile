import { CommonActions, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { ContractDetailsCard } from "../../organisms/contract/ContractDetailsCard";
import { ContractGenerationProgress } from "../../organisms/contract/ContractGenerationProgress";
import { NextStepsCard } from "../../organisms/NextStepsCard";
import { PaymentSuccessHeader } from "../../organisms/payment/PaymentSuccessHeader";

type RoutePropType = RouteProp<BookingStackParamList, "DigitalContract">;
type NavigationPropType = StackNavigationProp<BookingStackParamList, "DigitalContract">;

export const DigitalContractScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();

    const {
        vehicleId,
        vehicleName,
        vehicleImageUrl,
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
    const [showContractModal, setShowContractModal] = useState(false);

    console.log("Digital Contract - Vehicle:", vehicleName);
    console.log("Branch:", branchName);
    console.log("Contract Number:", contractNumber);

    const handleContractComplete = () => setContractGenerated(true);

    const handleViewBooking = () => {
        navigation.getParent()?.navigate("Booking", { screen: "Trips" });
    };

    const handleGoHome = () => {
        const rootNav = navigation.getParent()?.getParent();
        if (rootNav) {
            rootNav.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                })
            );
        } else {
            navigation.navigate("Home" as never);
        }
    };

    // HTML contract content with dynamic data
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hợp đồng thuê xe</title>
        <style>
            body { font-family: "Times New Roman", serif; font-size: 13px; margin: 10px; line-height: 1.5; color: #000; }
            h1 { text-align: center; font-size: 18px; font-weight: bold; }
            h2 { text-decoration: underline; font-weight: bold; font-size: 15px; }
            h3 { font-weight: bold; }
            .section { margin-top: 10px; }
            .signature-row { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { width: 48%; text-align: center; }
            .center { text-align: center; }
            .italic { font-style: italic; }
            .bold { font-weight: bold; }
        </style>
    </head>
    <body>
        <p class="center bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p class="center bold">Độc lập – Tự do – Hạnh phúc</p>

        <h1>HỢP ĐỒNG THUÊ XE</h1>
        <p class="center">Số: ${contractNumber}</p>

        <p class="italic">Hôm nay, tại ${branchName}, chúng tôi gồm:</p>

        <div class="section">
            <h2>1. BÊN GIAO XE</h2>
            <p>Công ty: eMotoRent</p>
            <p>Địa điểm giao xe: ${branchName}</p>
        </div>

        <div class="section">
            <h2>2. BÊN NHẬN XE</h2>
            <p>Người thuê: [Tên người thuê]</p>
            <p>Số CCCD: [Số CCCD]</p>
            <p class="italic">* Thông tin sẽ được cập nhật khi ký hợp đồng</p>
        </div>

        <div class="section">
            <h3>Điều 1. Thông tin xe thuê</h3>
            <p>Nhãn hiệu xe: ${vehicleName}</p>
            <p>Thời gian thuê: ${startDate} - ${endDate}</p>
            <p>Thời lượng: ${duration}</p>
            <p>Giá thuê: ${totalAmount}</p>
            <p>Tiền đặt cọc: ${securityDeposit}</p>
        </div>

        <div class="section">
            <h3>Điều 2. Nghĩa vụ của các bên</h3>
            <p class="bold">Bên cho thuê:</p>
            <p>- Giao xe đúng thời gian, địa điểm đã thỏa thuận</p>
            <p>- Đảm bảo xe trong tình trạng tốt, an toàn khi giao</p>
            <p>- Hỗ trợ bên thuê khi có sự cố trong quá trình sử dụng</p>
            
            <p class="bold">Bên thuê:</p>
            <p>- Thanh toán đầy đủ chi phí thuê xe theo thỏa thuận</p>
            <p>- Bảo quản xe cẩn thận, sử dụng đúng mục đích</p>
            <p>- Trả xe đúng thời gian, địa điểm đã thỏa thuận</p>
            <p>- Chịu trách nhiệm về mọi hư hỏng phát sinh trong thời gian thuê</p>
        </div>

        <div class="section">
            <h3>Điều 3. Điều khoản chung</h3>
            <p>- Hợp đồng có hiệu lực kể từ ngày ký</p>
            <p>- Mọi tranh chấp sẽ được giải quyết thông qua thương lượng</p>
            <p>- Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản</p>
        </div>

        <div class="signature-row">
            <div class="signature-box">
                <p class="bold">BÊN GIAO XE</p>
                <p class="italic">(Ký, đóng dấu)</p>
            </div>
            <div class="signature-box">
                <p class="bold">BÊN NHẬN XE</p>
                <p class="italic">(Ký tên)</p>
            </div>
        </div>
    </body>
    </html>`;

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

                        <View style={styles.contractPreviewCard}>
                            <Text style={styles.contractTitle}>Hợp đồng thuê xe</Text>
                            <Text style={styles.contractSummary}>
                                Đây là bản hợp đồng thuê xe giữa bạn và eMotoRent, bao gồm thông tin xe, thời gian thuê,
                                giá thuê và nghĩa vụ hai bên.
                            </Text>
                            <PrimaryButton
                                title="Đọc hợp đồng"
                                onPress={() => setShowContractModal(true)}
                                style={styles.readButton}
                            />
                        </View>

                        <View style={styles.confirmationCard}>
                            <Text style={styles.confirmationTitle}>Đặt xe thành công!</Text>
                            <Text style={styles.confirmationText}>
                                Đơn đặt xe của bạn đã được tạo thành công. Bạn sẽ nhận được email xác nhận trong giây lát.
                            </Text>
                            <Text style={styles.bookingReference}>Mã đặt xe: {contractNumber}</Text>
                        </View>

                        <NextStepsCard />

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Thông tin quan trọng</Text>

                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Vui lòng đến chi nhánh {branchName} trước 20 phút so với giờ đặt nhận xe
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>Mang theo CCCD và giấy phép lái xe</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoBullet}>•</Text>
                                <Text style={styles.infoText}>
                                    Tiền đặt cọc {securityDeposit} sẽ được hoàn lại trong vòng 7 ngày làm việc sau khi trả xe
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
                    <PrimaryButton title="Xem những lần đặt xe" onPress={handleViewBooking} />
                    <PrimaryButton
                        title="Về trang chủ"
                        onPress={handleGoHome}
                        style={styles.secondaryButton}
                    />
                </View>
            )}

            <Modal visible={showContractModal} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <WebView originWhitelist={["*"]} source={{ html: htmlContent }} />
                    <View style={styles.modalFooter}>
                        <PrimaryButton title="Đóng" onPress={() => setShowContractModal(false)} />
                    </View>
                </View>
            </Modal>
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
    confirmationTitle: { color: "#22c55e", fontSize: 20, fontWeight: "700", marginBottom: 12 },
    confirmationText: { color: "#fff", fontSize: 14, lineHeight: 20, marginBottom: 12 },
    bookingReference: { color: "#4169E1", fontSize: 14, fontWeight: "600" },
    infoCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    infoTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 16 },
    infoItem: { flexDirection: "row", marginBottom: 12 },
    infoBullet: { color: "#4169E1", fontSize: 16, marginRight: 8, width: 20 },
    infoText: { color: "#999", fontSize: 14, lineHeight: 20, flex: 1 },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    secondaryButton: { marginTop: 12, backgroundColor: "#1a1a1a" },
    contractPreviewCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    contractTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 8 },
    contractSummary: { color: "#999", fontSize: 14, lineHeight: 20, marginBottom: 12 },
    readButton: { backgroundColor: "#4169E1" },
    modalContainer: { flex: 1, backgroundColor: "#fff" },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },
});