import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

type ScanCitizenResultScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ScanCitizenResult"
>;

type ScanCitizenResultScreenRouteProp = RouteProp<
  StaffStackParamList,
  "ScanCitizenResult"
>;

export const ScanCitizenResultScreen: React.FC = () => {
  const navigation = useNavigation<ScanCitizenResultScreenNavigationProp>();
  const route = useRoute<ScanCitizenResultScreenRouteProp>();
  const { renter } = route.params || {};
  const [loaded, setLoaded] = useState(false);

  const handleContinueToReturn = () => {
    navigation.navigate("BookingReturnList", { renterId: renter.id });
  };

  const handleContinueToHandover = () => {
    navigation.navigate("CustomerRentals", { renterId: renter.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Xác minh danh tính khách hàng"
          submeta={renter.account?.fullname}
          onBack={() => navigation.goBack()}
        />

        {/* Customer Information Card */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerAvatar}>
              {renter.avatarUrl ? (
                <Image
                  source={{ uri: renter.avatarUrl }}
                  style={styles.avatarImage}
                  onLoad={() => setLoaded(true)}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <AntDesign name="user" size={40} color="#9CA3AF" />
                </View>
              )}
              {!loaded && renter.avatarUrl && (
                <ActivityIndicator
                  style={styles.avatarLoading}
                  size="small"
                  color="#999"
                />
              )}
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerNameLarge}>
                {renter.account?.fullname}
              </Text>
              <View style={styles.infoRow}>
                <AntDesign name="home" size={14} color="#7CFFCB" />
                <Text style={styles.customerAddress}>
                  {renter.address || "Chưa cập nhật"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <AntDesign name="phone" size={14} color="#7CFFCB" />
                <Text style={styles.customerPhone}>{renter.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <AntDesign name="mail" size={14} color="#7CFFCB" />
                <Text style={styles.customerEmail}>{renter.email}</Text>
              </View>
              {renter.dateOfBirth && (
                <View style={styles.infoRow}>
                  <AntDesign name="calendar" size={14} color="#7CFFCB" />
                  <Text style={styles.customerDob}>
                    Ngày sinh: {renter.dateOfBirth}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ID Card Scan Result Card */}
        <View style={styles.scanResultSection}>
          <View style={styles.scanResultCard}>
            {/* ID Card Icon with Verification Overlay */}
            <View style={styles.idCardContainer}>
              <View style={styles.idCardIcon}>
                <AntDesign name="idcard" size={80} color="#7CFFCB" />
              </View>
              <View style={styles.verificationBadge}>
                <AntDesign name="check" size={20} color="#FFFFFF" />
              </View>
            </View>

            {/* Verification Status */}
            <Text style={styles.verificationStatus}>
              Đã xác minh thành công
            </Text>
            <Text style={styles.verificationDescription}>
              Thông tin từ CCCD/CMND đã được xác nhận và khớp với hệ thống
            </Text>

            {/* Scan Method Badge */}
            <View style={styles.methodBadge}>
              <AntDesign name="qrcode" size={16} color="#7CFFCB" />
              <Text style={styles.methodBadgeText}>Quét mã QR CCCD</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleContinueToReturn}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <AntDesign name="swap" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.returnButtonText}>Tiếp tục trả xe</Text>
                <Text style={styles.returnButtonSubtext}>
                  Quy trình trả xe
                </Text>
              </View>
              <AntDesign name="right" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.handoverButton}
            onPress={handleContinueToHandover}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <AntDesign name="car" size={24} color="#000000" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.handoverButtonText}>
                  Tiếp tục bàn giao
                </Text>
                <Text style={styles.handoverButtonSubtext}>
                  Quy trình nhận xe
                </Text>
              </View>
              <AntDesign name="right" size={16} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  customerSection: {
    marginBottom: 24,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  customerCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  customerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1B1F2A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    overflow: "hidden",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1B1F2A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLoading: {
    position: "absolute",
  },
  customerDetails: {
    flex: 1,
  },
  customerNameLarge: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  customerAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  customerEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  customerDob: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scanResultSection: {
    marginBottom: 24,
  },
  scanResultCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  idCardContainer: {
    position: "relative",
    marginBottom: 20,
  },
  idCardIcon: {
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: "rgba(124,255,203,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(124,255,203,0.3)",
  },
  verificationBadge: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#11131A",
  },
  verificationStatus: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7CFFCB",
    marginBottom: 8,
    textAlign: "center",
  },
  verificationDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(124,255,203,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,255,203,0.3)",
  },
  methodBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7CFFCB",
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 16,
  },
  returnButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  handoverButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#C9B6FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  returnButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  returnButtonSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  handoverButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  handoverButtonSubtext: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.7)",
  },
});

