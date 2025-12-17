import {
    CommonActions,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { container } from "../../../../../../core/di/ServiceContainer";
import { ConfigurationType } from "../../../../../../domain/entities/configuration/ConfigurationType";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { ContractDetailsCard } from "../../organisms/contract/ContractDetailsCard";
import { ContractGenerationProgress } from "../../organisms/contract/ContractGenerationProgress";
import { NextStepsCard } from "../../organisms/NextStepsCard";
import { PaymentSuccessHeader } from "../../organisms/payment/PaymentSuccessHeader";
import { useRenterProfile } from "../../../../profile/hooks/profile/useRenterProfile";
import { SafeAreaView } from "react-native-safe-area-context";

type RoutePropType = RouteProp<BookingStackParamList, "DigitalContract">;
type NavigationPropType = StackNavigationProp<BookingStackParamList, "DigitalContract">;

export const DigitalContractScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const { renter, loading: profileLoading } = useRenterProfile();

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

    const displayContractNumber = contractNumber ?? "N/A";

    const [contractGenerated, setContractGenerated] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [contractTemplateUrl, setContractTemplateUrl] = useState<string | null>(null);
    const [loadingTemplate, setLoadingTemplate] = useState(false);
    const [templateError, setTemplateError] = useState<string | null>(null);

    // ==================== FETCH CONTRACT TEMPLATE FROM CONFIGURATION ====================
    useEffect(() => {
        fetchContractTemplate();
    }, []);

    const fetchContractTemplate = async () => {
        try {
            setLoadingTemplate(true);
            setTemplateError(null);

            console.log("📄 Fetching contract template from Configuration API...");
            
            const configurations = await container.configuration.getByType.execute(
                ConfigurationType.RentalContractTemplate
            );

            if (configurations && configurations.length > 0) {
                const templateConfig = configurations[0];
                const templateUrl = templateConfig.value;

                console.log("✅ Contract template fetched:", templateUrl);
                setContractTemplateUrl(templateUrl);
            } else {
                console.warn("⚠️ No contract template found in configurations");
                setTemplateError("Không tìm thấy mẫu hợp đồng");
            }
        } catch (error: any) {
            console.error("❌ Error fetching contract template:", error);
            setTemplateError(error.message || "Không thể tải mẫu hợp đồng");
        } finally {
            setLoadingTemplate(false);
        }
    };

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

    const handleViewContractTemplate = () => {
        if (contractTemplateUrl) {
            setShowContractModal(true);
        } else {
            Alert.alert(
                "Thông báo",
                "Mẫu hợp đồng chưa sẵn sàng. Vui lòng thử lại sau.",
                [{ text: "OK" }]
            );
        }
    };

    const handleRetryFetchTemplate = () => {
        fetchContractTemplate();
    };

    const handleCloseModal = () => {
        setShowContractModal(false);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                            contractNumber={displayContractNumber}
                            vehicleName={vehicleName}
                            rentalPeriod={`${startDate} - ${endDate}`}
                            duration={duration}
                            pickupLocation={branchName}
                            totalAmount={totalAmount}
                            securityDeposit={`${securityDeposit} (có thể hoàn lại)`}
                            imageUrl={vehicleImageUrl}
                        />

                        <View style={styles.contractPreviewCard}>
                            <View style={styles.contractPreviewHeader}>
                                <Text style={styles.contractTitle}>Hợp đồng thuê xe (Mẫu)</Text>
                                <View style={styles.sampleBadge}>
                                    <Text style={styles.sampleBadgeText}>MẪU</Text>
                                </View>
                            </View>
                            <Text style={styles.contractSummary}>
                                Đây là bản hợp đồng mẫu để bạn tham khảo. Hợp đồng chính thức sẽ được ký khi 
                                bạn đến nhận xe tại chi nhánh {branchName}.
                            </Text>

                            {loadingTemplate ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#fbbf24" />
                                    <Text style={styles.loadingText}>Đang tải mẫu hợp đồng...</Text>
                                </View>
                            ) : templateError ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{templateError}</Text>
                                    <PrimaryButton
                                        title="Thử lại"
                                        onPress={handleRetryFetchTemplate}
                                        style={styles.retryButton}
                                    />
                                </View>
                            ) : (
                                <>
                                    <PrimaryButton
                                        title="Xem hợp đồng mẫu"
                                        onPress={handleViewContractTemplate}
                                        style={styles.readButton}
                                        disabled={!contractTemplateUrl}
                                    />
                                    <Text style={styles.contractNote}>
                                        💡 Hợp đồng chính thức sẽ bao gồm đầy đủ thông tin xe và chữ ký điện tử
                                    </Text>
                                </>
                            )}
                        </View>

                        <View style={styles.confirmationCard}>
                            <Text style={styles.confirmationTitle}>Đặt xe thành công!</Text>
                            <Text style={styles.confirmationText}>
                                Đơn đặt xe của bạn đã được tạo thành công. Bạn sẽ nhận được email xác nhận trong giây lát.
                            </Text>
                            <Text style={styles.bookingReference}>
                                Mã đặt xe: {displayContractNumber}
                            </Text>
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
                                <Text style={styles.infoText}>
                                    Mang theo <Text style={styles.infoTextBold}>CCCD và giấy phép lái xe gốc</Text> để ký hợp đồng
                                </Text>
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
                        textStyle={styles.secondaryButtonText}
                    />
                </View>
            )}

            {/* ==================== CONTRACT TEMPLATE MODAL WITH GOOGLE DOCS VIEWER ==================== */}
            <Modal visible={showContractModal} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderContent}>
                            <View>
                                <Text style={styles.modalHeaderTitle}>Hợp đồng thuê xe (Mẫu)</Text>
                                <Text style={styles.modalHeaderSubtitle}>Mã đặt xe: {displayContractNumber}</Text>
                            </View>
                            <View style={styles.modalSampleBadge}>
                                <Text style={styles.modalSampleBadgeText}>MẪU</Text>
                            </View>
                        </View>
                        <View style={styles.modalNotice}>
                            <Text style={styles.modalNoticeIcon}>⚠️</Text>
                            <Text style={styles.modalNoticeText}>
                                Đây chỉ là hợp đồng mẫu. Hợp đồng chính thức sẽ được ký tại chi nhánh với đầy đủ thông tin chi tiết.
                            </Text>
                        </View>
                    </View>

                    {contractTemplateUrl ? (
                        <WebView
                            originWhitelist={["*"]}
                            source={{ 
                                uri: `https://docs.google.com/viewer?url=${encodeURIComponent(contractTemplateUrl)}&embedded=true`,
                            }}
                            style={styles.webview}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            scalesPageToFit={false}
                            showsVerticalScrollIndicator={true}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error("❌ WebView error:", nativeEvent);
                            }}
                            onLoadStart={() => {
                                console.log("📥 Starting to load PDF in WebView...");
                            }}
                            onLoadEnd={() => {
                                console.log("✅ PDF WebView loaded successfully");
                            }}
                            injectedJavaScript={`
                                (function() {
                                    // Wait for page to load
                                    setTimeout(function() {
                                        // Set initial zoom to 100%
                                        document.body.style.zoom = "100%";
                                        
                                        // Try to zoom in on the PDF viewer
                                        const meta = document.querySelector('meta[name="viewport"]');
                                        if (meta) {
                                            meta.setAttribute('content', 'width=device-width, initial-scale=1.5, maximum-scale=3.0, user-scalable=yes');
                                        }
                                    }, 1000);
                                })();
                                true;
                            `}
                            renderLoading={() => (
                                <View style={styles.webviewLoadingContainer}>
                                    <ActivityIndicator size="large" color="#fbbf24" />
                                    <Text style={styles.webviewLoadingText}>Đang tải PDF...</Text>
                                </View>
                            )}
                            startInLoadingState={true}
                        />
                    ) : (
                        <View style={styles.noContractContainer}>
                            <Text style={styles.noContractText}>Không tìm thấy mẫu hợp đồng</Text>
                            <PrimaryButton
                                title="Đóng"
                                onPress={handleCloseModal}
                                style={styles.retryButton}
                            />
                        </View>
                    )}

                    <View style={styles.modalFooter}>
                        <PrimaryButton 
                            title="Đóng" 
                            onPress={handleCloseModal}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
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
        marginBottom: 12 
    },
    confirmationText: { 
        color: "#fff", 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 12 
    },
    bookingReference: { 
        color: "#4169E1", 
        fontSize: 14, 
        fontWeight: "600" 
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
        marginBottom: 16 
    },
    infoItem: { 
        flexDirection: "row", 
        marginBottom: 12 
    },
    infoBullet: { 
        color: "#4169E1", 
        fontSize: 16, 
        marginRight: 8, 
        width: 20 
    },
    infoText: { 
        color: "#999", 
        fontSize: 14, 
        lineHeight: 20, 
        flex: 1 
    },
    infoTextBold: {
        color: "#fff",
        fontWeight: "700",
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
        borderWidth: 1, 
        borderColor: "#4169E1" 
    },
    secondaryButtonText: {
        color: "#4169E1",
    },

    contractPreviewCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#fbbf24",
    },
    contractPreviewHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    contractTitle: { 
        color: "#fff", 
        fontSize: 16, 
        fontWeight: "700",
        flex: 1,
    },
    sampleBadge: {
        backgroundColor: "#fbbf24",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    sampleBadgeText: {
        color: "#000",
        fontSize: 10,
        fontWeight: "700",
    },
    contractSummary: { 
        color: "#999", 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 12 
    },
    readButton: { 
        backgroundColor: "#fbbf24",
        marginBottom: 12,
    },
    contractNote: {
        color: "#fbbf24",
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },

    loadingContainer: {
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        color: "#fbbf24",
        fontSize: 14,
        marginTop: 8,
    },

    errorContainer: {
        padding: 16,
        alignItems: "center",
    },
    errorText: {
        color: "#ef4444",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 12,
    },
    retryButton: {
        backgroundColor: "#fbbf24",
        minWidth: 120,
    },

    modalContainer: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },
    modalHeader: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    modalHeaderContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 16,
    },
    modalHeaderTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        marginBottom: 4,
    },
    modalHeaderSubtitle: {
        fontSize: 14,
        color: "#666",
    },
    modalSampleBadge: {
        backgroundColor: "#fbbf24",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    modalSampleBadgeText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "700",
    },
    modalNotice: {
        backgroundColor: "#fff3cd",
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ffc107",
    },
    modalNoticeIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    modalNoticeText: {
        flex: 1,
        color: "#856404",
        fontSize: 13,
        lineHeight: 18,
    },
    webview: {
        flex: 1,
        backgroundColor: "#fff",
    },
    webviewLoadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    webviewLoadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#666",
    },
    noContractContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    noContractText: {
        fontSize: 16,
        color: "#999",
        marginBottom: 20,
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },
});