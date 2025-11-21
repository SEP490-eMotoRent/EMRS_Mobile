import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import sl from "../../../../../../core/di/InjectionContainer";
import { TicketTypeDisplay, TicketTypeEnum } from "../../../../../../domain/entities/operations/tickets/TicketEnums";
import { CreateTicketUseCase } from "../../../../../../domain/usecases/ticket/CreateTicketUseCase";
import { BackButton } from "../../../../../common/components";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { TripStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useCreateTicket } from "../../../hooks/Ticket/useCreateTicket";

type RoutePropType = RouteProp<TripStackParamList, "CreateTicket">;
type NavigationPropType = StackNavigationProp<TripStackParamList, "CreateTicket">;

interface TicketTypeOption {
    type: TicketTypeEnum;
    label: string;
    icon: string;
    description: string;
}

const TICKET_TYPE_OPTIONS: TicketTypeOption[] = [
    {
        type: TicketTypeEnum.WeakBattery,
        label: TicketTypeDisplay['WeakBattery'],
        icon: "🔋",
        description: "Pin yếu hoặc hết pin bất thường",
    },
    {
        type: TicketTypeEnum.FlatTyre,
        label: TicketTypeDisplay['FlatTyre'],
        icon: "🛞",
        description: "Lốp xe bị xẹp hoặc hư hỏng",
    },
    {
        type: TicketTypeEnum.UsageGuidance,
        label: TicketTypeDisplay['UsageGuidance'],
        icon: "❓",
        description: "Cần hướng dẫn sử dụng xe",
    },
    {
        type: TicketTypeEnum.OtherTechnical,
        label: TicketTypeDisplay['OtherTechnical'],
        icon: "⚙️",
        description: "Các vấn đề kỹ thuật khác",
    },
];

export const CreateTicketScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const { bookingId, vehicleName, licensePlate } = route.params;

    const createTicketUseCase = useMemo(
        () => sl.get<CreateTicketUseCase>("CreateTicketUseCase"),
        []
    );
    const { createTicket, loading } = useCreateTicket(createTicketUseCase);

    const [selectedType, setSelectedType] = useState<TicketTypeEnum | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleSelectType = (type: TicketTypeEnum) => {
        setSelectedType(type);
        // Auto-fill title based on type
        const option = TICKET_TYPE_OPTIONS.find((o) => o.type === type);
        if (option) {
            setTitle(option.label);
        }
    };

    const handlePickImage = async () => {
        if (attachments.length >= 5) {
            Alert.alert("Giới hạn", "Bạn chỉ có thể đính kèm tối đa 5 ảnh");
            return;
        }

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Quyền truy cập", "Cần quyền truy cập thư viện ảnh");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 5 - attachments.length,
        });

        if (!result.canceled && result.assets) {
            const newUris = result.assets.map((asset) => asset.uri);
            setAttachments((prev) => [...prev, ...newUris].slice(0, 5));
        }
    };

    const handleTakePhoto = async () => {
        if (attachments.length >= 5) {
            Alert.alert("Giới hạn", "Bạn chỉ có thể đính kèm tối đa 5 ảnh");
            return;
        }

        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Quyền truy cập", "Cần quyền truy cập camera");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setAttachments((prev) => [...prev, result.assets[0].uri].slice(0, 5));
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (selectedType === null) {
            Alert.alert("Thiếu thông tin", "Vui lòng chọn loại sự cố");
            return;
        }
        if (!title.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề");
            return;
        }
        if (!description.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng mô tả sự cố");
            return;
        }

        // Convert URIs to file objects for FormData
        const attachmentFiles = await Promise.all(
            attachments.map(async (uri, index) => {
                return {
                    uri,
                    type: "image/jpeg",
                    name: `ticket_photo_${index}.jpg`,
                } as any;
            })
        );

        const result = await createTicket({
            ticketType: selectedType,
            title: title.trim(),
            description: description.trim(),
            bookingId,
            attachments: attachmentFiles.length > 0 ? attachmentFiles : undefined,
        });

        if (result) {
            Alert.alert(
                "Thành công",
                "Ticket đã được gửi thành công. Nhân viên sẽ liên hệ hỗ trợ bạn sớm nhất.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }
    };

    const isFormValid = selectedType !== null && title.trim() && description.trim();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={handleBack} label="Quay lại" />
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>Báo cáo sự cố</Text>
                    <Text style={styles.headerSubtitle}>Gửi yêu cầu hỗ trợ kỹ thuật</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Vehicle Info Card */}
                    <View style={styles.vehicleCard}>
                        <View style={styles.vehicleIcon}>
                            <Text style={styles.vehicleIconText}>🏍</Text>
                        </View>
                        <View style={styles.vehicleInfo}>
                            <Text style={styles.vehicleName}>{vehicleName}</Text>
                            {licensePlate && (
                                <Text style={styles.licensePlate}>{licensePlate}</Text>
                            )}
                        </View>
                    </View>

                    {/* Ticket Type Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Loại sự cố *</Text>
                        <View style={styles.typeGrid}>
                            {TICKET_TYPE_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.type}
                                    style={[
                                        styles.typeCard,
                                        selectedType === option.type && styles.typeCardSelected,
                                    ]}
                                    onPress={() => handleSelectType(option.type)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.typeIcon}>{option.icon}</Text>
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            selectedType === option.type && styles.typeLabelSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    <Text style={styles.typeDescription}>{option.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Title Input */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tiêu đề *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tiêu đề ngắn gọn..."
                            placeholderTextColor="#666"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                        />
                        <Text style={styles.charCount}>{title.length}/100</Text>
                    </View>

                    {/* Description Input */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mô tả chi tiết *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Mô tả chi tiết sự cố bạn gặp phải..."
                            placeholderTextColor="#666"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            maxLength={1000}
                        />
                        <Text style={styles.charCount}>{description.length}/1000</Text>
                    </View>

                    {/* Attachments */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ảnh đính kèm (tùy chọn)</Text>
                        <Text style={styles.sectionHint}>Tối đa 5 ảnh</Text>

                        {/* Attachment Preview */}
                        {attachments.length > 0 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.attachmentScroll}
                            >
                                {attachments.map((uri, index) => (
                                    <View key={index} style={styles.attachmentItem}>
                                        <Image source={{ uri }} style={styles.attachmentImage} />
                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={() => handleRemoveAttachment(index)}
                                        >
                                            <Text style={styles.removeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        {/* Add Photo Buttons */}
                        <View style={styles.photoButtons}>
                            <TouchableOpacity
                                style={styles.photoButton}
                                onPress={handleTakePhoto}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.photoButtonIcon}>📷</Text>
                                <Text style={styles.photoButtonText}>Chụp ảnh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.photoButton}
                                onPress={handlePickImage}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.photoButtonIcon}>🖼</Text>
                                <Text style={styles.photoButtonText}>Chọn từ thư viện</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer */}
            <View style={styles.footer}>
                <PrimaryButton
                    title={loading ? "Đang gửi..." : "Gửi báo cáo"}
                    onPress={handleSubmit}
                    disabled={!isFormValid || loading}
                />
            </View>

            {/* Loading Overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#d4c5f9" />
                        <Text style={styles.loadingText}>Đang gửi ticket...</Text>
                    </View>
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
    flex: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    headerTextBlock: {
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: "#666",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    vehicleCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    vehicleIcon: {
        width: 48,
        height: 48,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    vehicleIconText: {
        fontSize: 24,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    licensePlate: {
        color: "#999",
        fontSize: 14,
        marginTop: 2,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
    },
    sectionHint: {
        color: "#666",
        fontSize: 13,
        marginTop: -8,
        marginBottom: 12,
    },
    typeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    typeCard: {
        width: "47%",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "#2a2a2a",
    },
    typeCardSelected: {
        borderColor: "#d4c5f9",
        backgroundColor: "#1a1a2a",
    },
    typeIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    typeLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 4,
    },
    typeLabelSelected: {
        color: "#d4c5f9",
    },
    typeDescription: {
        color: "#666",
        fontSize: 12,
        lineHeight: 16,
    },
    input: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    textArea: {
        minHeight: 120,
        paddingTop: 16,
    },
    charCount: {
        color: "#666",
        fontSize: 12,
        textAlign: "right",
        marginTop: 4,
    },
    attachmentScroll: {
        marginBottom: 12,
    },
    attachmentItem: {
        marginRight: 12,
        position: "relative",
    },
    attachmentImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        backgroundColor: "#ef4444",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    removeButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    photoButtons: {
        flexDirection: "row",
        gap: 12,
    },
    photoButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        gap: 8,
    },
    photoButtonIcon: {
        fontSize: 20,
    },
    photoButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    bottomSpacing: {
        height: 100,
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    loadingBox: {
        backgroundColor: "#1a1a1a",
        padding: 24,
        borderRadius: 16,
        alignItems: "center",
        gap: 12,
    },
    loadingText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});