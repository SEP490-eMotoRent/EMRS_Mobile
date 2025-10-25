import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../../common/theme/colors";

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showPercentage?: boolean;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  totalSteps,
  showPercentage = true,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>Step {currentStep}/{totalSteps}</Text>
        {showPercentage && (
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        )}
      </View>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              index < currentStep ? styles.progressSegmentActive : styles.progressSegmentInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#C9B6FF",
    fontWeight: "bold",
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  progressSegment: {
    width: 80,
    height: 6,
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: "#C9B6FF",
  },
  progressSegmentInactive: {
    backgroundColor: "#444444",
  },
});
