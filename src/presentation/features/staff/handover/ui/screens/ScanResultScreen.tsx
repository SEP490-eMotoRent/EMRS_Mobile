import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
const customerAvatar = require("../../../../../../../assets/images/avatar.png");

type ScanResultScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ScanResult"
>;

export const ScanResultScreen: React.FC = () => {
  const navigation = useNavigation<ScanResultScreenNavigationProp>();

  const handleContinueToHandover = () => {
    console.log("Continue to handover");
    navigation.navigate("CustomerRentals");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Verify Customer Identity"
          subtitle="#EMR240915001"
          submeta="John Nguyen"
          onBack={() => navigation.goBack()}
        />

        {/* Customer Information Card */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerAvatar}>
              <Image source={customerAvatar} style={styles.avatarImage} />
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerNameLarge}>John Nguyen</Text>
              <Text style={styles.customerStatus}>Expected customer</Text>
              <Text style={styles.customerPhone}>Phone: ***8901</Text>
              <Text style={styles.customerVehicle}>
                Vehicle: VinFast Evo200
              </Text>
              <Text style={styles.pickupTime}>Pickup time: 10:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Face Scan Result Card */}
        <View style={styles.scanResultSection}>
          <View style={styles.scanResultCard}>
            {/* Face Image with Verification Overlay */}
            <View style={styles.faceImageContainer}>
              <View style={styles.faceImage}>
                <Image source={customerAvatar} style={styles.faceImage} />
              </View>
              <View style={styles.verificationBadge}>
                <AntDesign name="check" size={20} color="#FFFFFF" />
              </View>
            </View>

            {/* Verification Status */}
            <Text style={styles.verificationStatus}>
              Identity Verified - 98% match
            </Text>
            <Text style={styles.verificationDescription}>
              Customer identity confirmed
            </Text>
          </View>
        </View>

        {/* Match Confidence */}
        <View style={styles.confidenceCard}>
          <View style={styles.confidenceSection}>
            <View style={styles.confidenceImages}>
              <View style={styles.confidenceImage}>
                <Image source={customerAvatar} style={styles.confidenceImage} />
              </View>
              <View style={styles.confidenceImage}>
                <Image source={customerAvatar} style={styles.confidenceImage} />
              </View>
            </View>
            <View>
              <Text style={styles.confidenceLabel}>Match Confidence</Text>
              <Text style={styles.confidenceValue}>98%</Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueToHandover}
        >
          <Text style={styles.continueButtonText}>Continue to Handover</Text>
          <AntDesign name="right" size={16} color="#000" />
        </TouchableOpacity>
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
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: "600",
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
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  customerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#444444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  avatarText: {
    fontSize: 32,
  },
  customerDetails: {
    flex: 1,
  },
  customerNameLarge: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  customerStatus: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  customerVehicle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scanResultSection: {
    marginBottom: 32,
  },
  scanResultCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    alignItems: "center",
  },
  confidenceCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
  },
  faceImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  faceImagePlaceholder: {
    width: 200,
    height: 250,
    backgroundColor: "#444444",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  faceImage: {
    width: 350,
    height: 350,
    backgroundColor: "#444444",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  verificationBadge: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  verificationStatus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "center",
  },
  verificationDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: "center",
  },
  confidenceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  confidenceImages: {
    flexDirection: "row",
    marginRight: 20,
  },
  confidenceImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#444444",
    marginRight: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  continueButton: {
    backgroundColor: "#C9B6FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
