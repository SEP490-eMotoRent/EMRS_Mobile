import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StepProgressBar } from "../atoms";

const vehicleImage = require("../../../../../../../assets/images/technician.png");

type AIAnalysisScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AIAnalysis"
>;

export const AIAnalysisScreen: React.FC = () => {
  const navigation = useNavigation<AIAnalysisScreenNavigationProp>();
  const [confirmIssue, setConfirmIssue] = useState(false);

  const handleContinue = () => {
    console.log("Continue to manual check");
    // Navigate to next step
  };

  const toggleConfirmIssue = () => {
    setConfirmIssue(!confirmIssue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="AI Analysis"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />
        
        <StepProgressBar currentStep={2} totalSteps={4} />

        {/* Vehicle Verification Card */}
        <View style={styles.verificationCard}>
          <View style={styles.verificationIcon}>
            <AntDesign name="safety" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.verificationContent}>
            <View style={styles.verificationHeader}>
              <Text style={styles.verificationTitle}>Vehicle Verified</Text>
              <AntDesign name="check" size={16} color="#4CAF50" />
            </View>
            <Text style={styles.verificationDescription}>
              Return Vehicle matched with handover photos
            </Text>
          </View>
        </View>

        {/* AI Detected Issues Section */}
        <View style={styles.issuesSection}>
          <View style={styles.issuesHeader}>
            <AntDesign name="warning" size={20} color="#FF6B35" />
            <Text style={styles.issuesTitle}>AI Detected Issues</Text>
          </View>
          
          <View style={styles.issuesCard}>
            <View style={styles.issueImages}>
              <Image source={vehicleImage} style={styles.issueImage} />
              <Image source={vehicleImage} style={styles.issueImage} />
            </View>
            
            <View style={styles.issueDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>Rear bumper - Right side</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Severity</Text>
                <View style={styles.severityTag}>
                  <Text style={styles.severityText}>Minor</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>AI Confidence</Text>
                <Text style={styles.detailValue}>92%</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.confirmRow}
                onPress={toggleConfirmIssue}
              >
                <View style={styles.checkbox}>
                  {confirmIssue && (
                    <AntDesign name="check" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.confirmText}>Confirm Issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Disclaimer Bar */}
        <View style={styles.disclaimerBar}>
          <Text style={styles.disclaimerText}>
            AI suggestions only - Staff must verify all damages
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue to Manual Check</Text>
        </TouchableOpacity>
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
  verificationCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.2)",
  },
  verificationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  verificationContent: {
    alignItems: "center",
  },
  verificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginRight: 8,
  },
  verificationDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  issuesSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  issuesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  issuesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginLeft: 8,
  },
  issuesCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 20,
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
  },
  issueImages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  issueImage: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#444444",
  },
  issueDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    flex: 1,
    textAlign: "right",
  },
  severityTag: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  severityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  confirmText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: "500",
  },
  disclaimerBar: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
  },
  disclaimerText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: colors.button.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
    shadowColor: "#C9B6FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: colors.text.dark,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
