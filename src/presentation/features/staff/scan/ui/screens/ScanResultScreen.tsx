import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
const customerAvatar = require("../../../../../../../assets/images/avatar.png");
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleContinueToReturn = () => {
    console.log("Continue to return");
    navigation.navigate("VehicleConfirmation");
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
                <Text style={styles.returnButtonText}>Continue to Return</Text>
                <Text style={styles.returnButtonSubtext}>Vehicle return process</Text>
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
                <Text style={styles.handoverButtonText}>Continue to Handover</Text>
                <Text style={styles.handoverButtonSubtext}>Vehicle pickup process</Text>
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
