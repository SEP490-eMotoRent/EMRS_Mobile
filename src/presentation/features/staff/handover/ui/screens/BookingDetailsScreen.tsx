import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { SectionHeader } from "../molecules/SectionHeader";
import { InfoCard } from "../../../../../common/components/molecules/InfoCard";
import { InfoItem } from "../../../../../common/components/molecules/InfoItem";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";

type BookingDetailsScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "BookingDetails"
>;

export const BookingDetailsScreen: React.FC = () => {
  const navigation = useNavigation<BookingDetailsScreenNavigationProp>();

  const handleProceedToCheck = () => {
    console.log("Proceed to check car");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Booking Details"
          subtitle="John Nguyen"
          submeta="ID: #EMR240915001"
          onBack={() => navigation.goBack()}
        />

        {/* Customer Information */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin Khách hàng" icon="user" />
          <InfoCard>
            <Text style={styles.customerName}>NGUYEN VAN A</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>CCCD: 049897456123</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>SDT: 0987654123</Text>
            </View>
          </InfoCard>
        </View>

        {/* Booking Information */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin Booking" icon="calendar" />
          <InfoCard>
            <InfoItem label="Mã Booking:" value="BK001-345-987" />
            <InfoItem
              label="Địa điểm:"
              value="Xx Street, Ward 2, Tan Binh District"
            />
            <InfoItem label="Thời gian thuê:" value="06/09/2025 - 09:00" />
            <InfoItem label="Thời gian trả:" value="07/09/2025 - 09:00" />
            <InfoItem label="Gói thuê:" value="24 giờ" />
          </InfoCard>
        </View>

        {/* Insurance Information */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin Bảo hiểm" icon="safety-certificate" />
          <InfoCard>
            <InfoItem label="Gói bảo hiểm:" value="Premium" />
            <InfoItem label="Mức bồi thường:" value="50,000,000 VND" />
          </InfoCard>
        </View>

        {/* Total Cost */}
        <View style={styles.section}>
          <SectionHeader title="Tổng chi phí" icon="wallet" />
          <InfoCard>
            <InfoItem label="Thuê xe VinFast Evo200:" value="450,000 VND" />
            <InfoItem label="Bảo hiểm Premium:" value="50,000 VND" />
            <InfoItem label="Phí dịch vụ:" value="25,000 VND" />
          </InfoCard>
        </View>

        {/* Proceed Button */}
        <PrimaryButton
          title="Tiến hành kiểm tra xe"
          onPress={handleProceedToCheck}
          style={styles.proceedButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  bullet: {
    fontSize: 14,
    color: colors.text.secondary,
    marginHorizontal: 8,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    marginRight: 16,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  proceedButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  proceedButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
