import React, { useState } from "react";
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StepProgressBar } from "../atoms";
import { SafeAreaView } from "react-native-safe-area-context";

type AIAnalysisScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AIAnalysis"
>;

type AIAnalysisScreenRouteProp = RouteProp<StaffStackParamList, "AIAnalysis">;

export const AIAnalysisScreen: React.FC = () => {
  const navigation = useNavigation<AIAnalysisScreenNavigationProp>();
  const route = useRoute<AIAnalysisScreenRouteProp>();
  const { bookingId, analyzeReturnData } = route.params;
  const [confirmIssue, setConfirmIssue] = useState(false);

  const handleContinue = () => {
    navigation.navigate("ManualInspection", {
      bookingId,
      photos: analyzeReturnData?.uploadedImageUrls,
    });
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
          <View
            style={[
              styles.verificationIcon,
              !analyzeReturnData?.verificationResult?.isVerified &&
                styles.verificationIconWarning,
            ]}
          >
            <AntDesign
              name={
                analyzeReturnData?.verificationResult?.isVerified
                  ? "check-circle"
                  : "warning"
              }
              size={32}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.verificationContent}>
            <View style={styles.verificationHeader}>
              <Text style={styles.verificationTitle}>
                {analyzeReturnData?.verificationResult?.isVerified
                  ? "Vehicle Verified"
                  : "Verification Failed"}
              </Text>
              <AntDesign
                name={
                  analyzeReturnData?.verificationResult?.isVerified
                    ? "check"
                    : "close-circle"
                }
                size={16}
                color={
                  analyzeReturnData?.verificationResult?.isVerified
                    ? "#4CAF50"
                    : "#FF6B35"
                }
              />
            </View>
            <Text style={styles.verificationDescription}>
              {analyzeReturnData?.verificationResult?.reason ||
                (analyzeReturnData?.verificationResult?.isVerified
                  ? "Return Vehicle matched with handover photos"
                  : "Return Vehicle does not match with handover photos")}
            </Text>
            {/* {analyzeReturnData?.verificationResult?.confidence && (
              <View style={styles.confidenceBar}>
                <Text style={styles.confidenceLabel}>Confidence:</Text>
                <Text style={styles.confidenceValue}>
                  { analyzeReturnData?.verificationResult?.confidence ? Math.round(
                    analyzeReturnData?.verificationResult?.confidence * 100
                  ) : 0}
                  %
                </Text>
              </View>
            )} */}
          </View>
        </View>

        {/* AI Detected Issues Section */}
        {analyzeReturnData?.damageResult?.hasNewDamages ? (
          <View style={styles.issuesSection}>
            <View style={styles.issuesHeader}>
              <AntDesign name="warning" size={20} color="#FF6B35" />
              <Text style={styles.issuesTitle}>AI Detected Issues</Text>
            </View>

            <View style={styles.issuesCard}>
              {analyzeReturnData?.uploadedImageUrls &&
                analyzeReturnData.uploadedImageUrls.length > 0 && (
                  <View style={styles.issueImages}>
                    {analyzeReturnData.uploadedImageUrls
                      .slice(0, 2)
                      .map((uri, index) => (
                        <Image
                          key={index}
                          source={{ uri }}
                          style={styles.issueImage}
                        />
                      ))}
                  </View>
                )}

              <View style={styles.issueDetails}>
                {analyzeReturnData?.damageResult?.suggestions &&
                  analyzeReturnData.damageResult.suggestions.length > 0 && (
                    <>
                      <Text style={styles.suggestionsTitle}>
                        Damage Suggestions:
                      </Text>
                      {analyzeReturnData.damageResult.suggestions.map(
                        (suggestion, index) => (
                          <View key={index} style={styles.suggestionItem}>
                            <AntDesign
                              name="exclamation-circle"
                              size={14}
                              color="#FF6B35"
                            />
                            <Text style={styles.suggestionText}>
                              {suggestion}
                            </Text>
                          </View>
                        )
                      )}
                    </>
                  )}

                <TouchableOpacity
                  style={styles.confirmRow}
                  onPress={toggleConfirmIssue}
                >
                  <View
                    style={[
                      styles.checkbox,
                      confirmIssue && styles.checkboxChecked,
                    ]}
                  >
                    {confirmIssue && (
                      <AntDesign name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.confirmText}>Confirm Issue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noIssuesCard}>
            <View style={styles.noIssuesIcon}>
              <AntDesign name="check-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.noIssuesTitle}>No New Damages Detected</Text>
            <Text style={styles.noIssuesText}>
              The vehicle condition matches the handover inspection. No new
              damages found.
            </Text>
          </View>
        )}

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
          <Text style={styles.continueButtonText}>
            Continue to Manual Check
          </Text>
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
  verificationIconWarning: {
    backgroundColor: "#FF6B35",
    shadowColor: "#FF6B35",
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
    marginBottom: 12,
  },
  confidenceBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginRight: 8,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
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
    resizeMode: "cover",
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    marginLeft: 8,
    lineHeight: 18,
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
  checkboxChecked: {
    backgroundColor: "#C9B6FF",
    borderColor: "#C9B6FF",
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
  noIssuesCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  noIssuesIcon: {
    marginBottom: 16,
  },
  noIssuesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  noIssuesText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
