import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";

import { colors } from "../../../../common/theme/colors";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { StaffStackParamList } from "../../../../shared/navigation/StackParameters/types";
import sl from "../../../../../core/di/InjectionContainer";
import { RentalReceipt } from "../../../../../domain/entities/booking/RentalReceipt";
import { GetBookingByIdUseCase } from "../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { Booking } from "../../../../../domain/entities/booking/Booking";
import { GetDetailRentalReceiptUseCase } from "../../../../../domain/usecases/receipt/GetDetailRentalReceipt";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type NavProp = StackNavigationProp<
  StaffStackParamList,
  "HandoverReceiptReport"
>;

type RouteProps = RouteProp<StaffStackParamList, "HandoverReceiptReport">;

const formatDateTime = (value?: Date | string | null) => {
  if (!value) {
    return "-";
  }

  const dateValue = typeof value === "string" ? new Date(value) : value;

  if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
    return dateValue.toLocaleString("en-GB");
  }

  return "-";
};

export const HandoverReceiptReportScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { bookingId, rentalReceiptId } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rentalReceipt, setRentalReceipt] = useState<RentalReceipt | null>(
    null
  );
  const [booking, setBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView | null>(null);
  const thumbnailScrollRef = useRef<ScrollView | null>(null);

  const handoverImages = rentalReceipt?.handOverVehicleImageFiles ?? [];
  const checklistHandoverImage = rentalReceipt?.checkListHandoverFile
    ? [rentalReceipt?.checkListHandoverFile].flat()[0]
    : undefined;

  const loadData = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }
        setErrorMessage(null);
        const [receiptRes, bookingRes] = await Promise.all([
          new GetDetailRentalReceiptUseCase(
            sl.get("ReceiptRepository")
          ).execute(rentalReceiptId),
          new GetBookingByIdUseCase(sl.get("BookingRepository")).execute(
            bookingId
          ),
        ]);

        setRentalReceipt(receiptRes.data);
        setBooking(bookingRes);
      } catch (error: any) {
        console.error("Failed to load handover receipt:", error);
        setErrorMessage(error?.message ?? "Không thể tải biên bản bàn giao.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [bookingId]
  );

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(false);
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const closeImageModal = () => setImageModalVisible(false);

  const handleImageScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setSelectedImageIndex(index);

    if (thumbnailScrollRef.current && handoverImages.length > 0) {
      const thumbnailWidth = 60 + 8;
      const scrollPosition = Math.max(0, (index - 2) * thumbnailWidth);
      thumbnailScrollRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  };

  const scrollToImage = (index: number) => {
    if (imageScrollRef.current) {
      imageScrollRef.current.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
    }
    setSelectedImageIndex(index);

    if (thumbnailScrollRef.current && handoverImages.length > 0) {
      const thumbnailWidth = 60 + 8;
      const scrollPosition = Math.max(0, (index - 2) * thumbnailWidth);
      thumbnailScrollRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (
      imageModalVisible &&
      imageScrollRef.current &&
      handoverImages.length > 0
    ) {
      const timeout = setTimeout(() => {
        imageScrollRef.current?.scrollTo({
          x: selectedImageIndex * SCREEN_WIDTH,
          animated: false,
        });

        if (thumbnailScrollRef.current) {
          const thumbnailWidth = 60 + 8;
          const scrollPosition = Math.max(
            0,
            (selectedImageIndex - 2) * thumbnailWidth
          );
          thumbnailScrollRef.current.scrollTo({
            x: scrollPosition,
            animated: false,
          });
        }
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [imageModalVisible, selectedImageIndex, handoverImages.length]);

  const renderContent = () => {
    const staffName =
      rentalReceipt?.staff?.account?.fullname ??
      rentalReceipt?.staff?.account?.username ??
      "-";
    const branchName =
      rentalReceipt?.staff?.branch?.branchName ??
      rentalReceipt?.staff?.branch?.fullAddress?.() ??
      "-";
    const bookingCode = booking?.id ? `#${booking.id.slice(-8)}` : "-";

    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải biên bản bàn giao...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.errorCard}>
          <AntDesign name="warning" size={20} color="#F97316" />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadData()}>
            <AntDesign name="reload" size={14} color="#000" />
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <>
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBadge, { backgroundColor: "rgba(201, 182, 255, 0.15)" }]}>
                <AntDesign name="idcard" size={16} color="#C9B6FF" />
              </View>
              <Text style={styles.cardHeader}>Thông tin chung</Text>
            </View>
            <View style={styles.divider} />
            <InfoRow 
              label="Khách thuê" 
              icon="user"
              iconColor="#C9B6FF"
            >
              {booking?.renter?.fullName() || "-"}
            </InfoRow>
            <InfoRow 
              label="Mã booking" 
              icon="tag"
              iconColor="#7DB3FF"
            >
              {bookingCode}
            </InfoRow>
            <InfoRow 
              label="Biên bản" 
              icon="file-text"
              iconColor="#3B82F6"
            >
              {rentalReceipt?.id ? `#${rentalReceipt?.id.slice(-8)}` : "-"}
            </InfoRow>
            <InfoRow 
              label="Thời gian tạo" 
              icon="clock-circle"
              iconColor="#FFD666"
            >
              {formatDateTime(rentalReceipt?.createdAt)}
            </InfoRow>
            {rentalReceipt?.notes && (
              <InfoRow 
                label="Ghi chú" 
                icon="message"
                iconColor="#22C55E"
              >
                {rentalReceipt.notes}
              </InfoRow>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBadge, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                <AntDesign name="dashboard" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.cardHeader}>Thông số ban đầu</Text>
            </View>
            <View style={styles.divider} />
            <InfoRow 
              label="Số km ban đầu" 
              icon="dashboard"
              iconColor="#F59E0B"
            >
              {rentalReceipt?.startOdometerKm ?? "-"} km
            </InfoRow>
            <InfoRow 
              label="Pin ban đầu" 
              icon="thunderbolt"
              iconColor="#3B82F6"
            >
              {rentalReceipt?.startBatteryPercentage ?? "-"}%
            </InfoRow>
            <InfoRow 
              label="Nhân viên bàn giao" 
              icon="user"
              iconColor="#22C55E"
            >
              {staffName}
            </InfoRow>
            <InfoRow 
              label="Chi nhánh" 
              icon="environment"
              iconColor="#7DB3FF"
            >
              {branchName}
            </InfoRow>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBadge, { backgroundColor: "rgba(34, 197, 94, 0.15)" }]}>
                <AntDesign name="picture" size={16} color="#22C55E" />
              </View>
              <View style={styles.cardHeaderRight}>
                <Text style={styles.cardHeader}>Ảnh xe bàn giao</Text>
                {handoverImages.length > 0 && (
                  <Text style={styles.imageCount}>
                    {handoverImages.length} ảnh
                  </Text>
                )}
              </View>
            </View>
            {handoverImages.length > 0 ? (
              <>
                <View style={styles.divider} />
                <View style={styles.photoGrid}>
                  {handoverImages.map((uri, index) => (
                    <TouchableOpacity
                      key={uri + index}
                      style={styles.photoItem}
                      activeOpacity={0.85}
                      onPress={() => openImageModal(index)}
                    >
                      <Image source={{ uri }} style={styles.photoImage} />
                      <View style={styles.photoOverlay}>
                        <View style={styles.photoOverlayIcon}>
                          <AntDesign name="eye" size={20} color="#fff" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View style={styles.divider} />
                <View style={styles.emptyState}>
                  <AntDesign name="picture" size={32} color={colors.text.secondary} />
                  <Text style={styles.emptyStateText}>Chưa có ảnh bàn giao</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {checklistHandoverImage && (
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBadge, { backgroundColor: "rgba(255, 214, 102, 0.15)" }]}>
                  <AntDesign name="check-square" size={16} color="#FFD666" />
                </View>
                <Text style={styles.cardHeader}>Checklist bàn giao</Text>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.checklistWrap}
                onPress={() => openImageModal(handoverImages.length)}
              >
                <Image
                  source={{ uri: checklistHandoverImage }}
                  style={styles.checklistImage}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay}>
                  <View style={styles.photoOverlayIcon}>
                    <AntDesign name="eye" size={20} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  };

  const combinedImages = checklistHandoverImage
    ? [...handoverImages, checklistHandoverImage]
    : handoverImages;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ScreenHeader
          title="Biên bản bàn giao"
          subtitle={booking?.renter?.fullName() || ""}
          onBack={() => navigation.goBack()}
        />

        {renderContent()}
      </ScrollView>

      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
        statusBarTranslucent
      >
        <View style={styles.imageModalContainer}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="rgba(0,0,0,0.95)"
          />
          <SafeAreaView edges={["top"]}>
            <View style={styles.imageModalHeader}>
              <Text style={styles.imageModalCounter}>
                {selectedImageIndex + 1} / {combinedImages.length}
              </Text>
              <TouchableOpacity
                style={styles.imageModalCloseButton}
                onPress={closeImageModal}
                activeOpacity={0.7}
              >
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            style={styles.imageModalScroll}
            decelerationRate="fast"
          >
            {combinedImages.map((image, index) => (
              <View key={image + index} style={styles.imageModalImageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.imageModalImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {combinedImages.length > 1 && (
            <View style={styles.imageModalThumbnailStrip}>
              <ScrollView
                ref={thumbnailScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageModalThumbnailScrollContent}
              >
                {combinedImages.map((image, index) => (
                  <TouchableOpacity
                    key={image + index}
                    style={[
                      styles.imageModalThumbnailItem,
                      selectedImageIndex === index &&
                        styles.imageModalThumbnailItemActive,
                    ]}
                    onPress={() => scrollToImage(index)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.imageModalThumbnailImage}
                    />
                    {selectedImageIndex === index && (
                      <View style={styles.imageModalThumbnailIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

type InfoRowProps = {
  label: string;
  children: React.ReactNode;
  icon?: keyof typeof AntDesign.glyphMap;
  iconColor?: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, children, icon, iconColor = colors.text.secondary }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelContainer}>
      {icon && (
        <AntDesign name={icon} size={12} color={iconColor} style={styles.infoIcon} />
      )}
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  imageCount: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 12,
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  infoIcon: {
    marginRight: 2,
  },
  infoLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    flex: 1,
  },
  infoValue: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  photoOverlayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  emptyState: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyStateText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 8,
  },
  checklistWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
    position: "relative",
    maxHeight: 400,
  },
  checklistImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  errorCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "rgba(249,115,22,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F97316",
    padding: 16,
    gap: 12,
    alignItems: "center",
  },
  errorText: {
    color: colors.text.primary,
    fontSize: 13,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#FFD666",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    marginTop: 40,
  },
  imageModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageModalCounter: { color: "#fff", fontSize: 14, fontWeight: "600" },
  imageModalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalScroll: {
    flex: 1,
  },
  imageModalImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  imageModalImage: {
    width: SCREEN_WIDTH - 40,
    height: "100%",
  },
  imageModalThumbnailStrip: {
    backgroundColor: "rgba(0,0,0,0.8)",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingVertical: 12,
  },
  imageModalThumbnailScrollContent: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  imageModalThumbnailItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  imageModalThumbnailItemActive: {
    borderColor: "#C9B6FF",
  },
  imageModalThumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageModalThumbnailIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(201,182,255,0.25)",
    borderWidth: 2,
    borderColor: "#C9B6FF",
    borderRadius: 6,
  },
});
