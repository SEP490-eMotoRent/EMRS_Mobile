import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepProgressBar } from "../atoms";

const customerAvatar = require("../../../../../../../assets/images/avatar2.png");

type ReturnInspectionScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ReturnInspection"
>;

export const ReturnInspectionScreen: React.FC = () => {
  const navigation = useNavigation<ReturnInspectionScreenNavigationProp>();
  const [batteryPercentage, setBatteryPercentage] = useState("57");

  const handleContinue = () => {
    console.log("Continue to AI Analysis");
    navigation.navigate("AIAnalysis");
  };

  const handleCapturePhoto = (angle: string) => {
    console.log(`Capture photo for ${angle}`);
    // Open camera for photo capture
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Return Inspection"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />
        <StepProgressBar currentStep={1} totalSteps={4} />

        {/* User and Vehicle Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.userInfo}>
            <Image source={customerAvatar} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>John Nguyen</Text>
              <Text style={styles.userBranch}>District 2 Branch</Text>
            </View>
          </View>

          <View style={styles.vehicleInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vehicle</Text>
              <Text style={styles.infoValue}>VinFast Evo200 - 59X1-12345</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Return Time</Text>
              <Text style={styles.infoValue}>11:00 AM</Text>
            </View>
          </View>
        </View>

        {/* Capture Vehicle Photos Section */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>
            Capture Vehicle Photos (4 angles required)
          </Text>
          <View style={styles.photoGrid}>
            <TouchableOpacity
              style={styles.photoCard}
              onPress={() => handleCapturePhoto("Front")}
            >
              <AntDesign name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.photoLabel}>Front</Text>
              <Text style={styles.photoSubtext}>Tap to Capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoCard}
              onPress={() => handleCapturePhoto("Rear")}
            >
              <AntDesign name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.photoLabel}>Rear</Text>
              <Text style={styles.photoSubtext}>Tap to Capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoCard}
              onPress={() => handleCapturePhoto("Left Side")}
            >
              <AntDesign name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.photoLabel}>Left Side</Text>
              <Text style={styles.photoSubtext}>Tap to Capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoCard}
              onPress={() => handleCapturePhoto("Right Side")}
            >
              <AntDesign name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.photoLabel}>Right Side</Text>
              <Text style={styles.photoSubtext}>Tap to Capture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Battery Status Section */}
        <View style={styles.batterySection}>
          <Text style={styles.sectionTitle}>Battery Status</Text>

          <View style={styles.batteryContainer}>
            <View style={styles.batteryCircle}>
              <View style={styles.batteryInner}>
                <Text style={styles.batteryPercentage}>57%</Text>
                <View style={styles.batteryIcon}>
                  <Entypo name="battery" size={16} color="#4CAF50" />
                </View>
              </View>
            </View>
            <Text style={styles.batteryLabel}>Current Battery %</Text>
          </View>

          <View style={styles.batteryInputContainer}>
            <View style={styles.inputWrapper}>
              <AntDesign name="edit" size={16} color={colors.text.secondary} />
              <TextInput
                style={styles.batteryInput}
                value={batteryPercentage}
                onChangeText={setBatteryPercentage}
                keyboardType="numeric"
                placeholder="Enter battery %"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>

          <View style={styles.lastRecordedContainer}>
            <AntDesign
              name="clock-circle"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.lastRecorded}>Last recorded: 85%</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#444444",
    marginTop: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  userBranch: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  vehicleInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    textAlign: "right",
  },
  photoSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoCard: {
    width: "48%",
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  photoSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  batterySection: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  batteryContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  batteryCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  batteryInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  batteryPercentage: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  batteryIcon: {
    marginTop: 4,
  },
  batteryLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  batteryInputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#444444",
  },
  batteryInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
    fontWeight: "500",
  },
  lastRecordedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lastRecorded: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
