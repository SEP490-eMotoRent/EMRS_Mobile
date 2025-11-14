import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProgressDot } from "../atoms/indicators/ProgressDot";
import { ProgressLine } from "../atoms/indicators/ProgressLine";

interface ProgressIndicatorProps {
    currentStep: number; // 1, 2, 3, or 4
    totalSteps: number;
}

const STEP_LABELS = ["Thời gian", "Bảo hiểm", "Thanh toán", "Hoàn tất"];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
    currentStep,
    totalSteps
}) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            <View style={styles.stepColumn}>
                                <ProgressDot 
                                    isActive={isActive} 
                                    isCompleted={isCompleted}
                                    stepNumber={stepNumber}
                                />
                                <Text style={[
                                    styles.stepLabel,
                                    isActive && styles.stepLabelActive,
                                    isCompleted && styles.stepLabelCompleted,
                                ]}>
                                    {STEP_LABELS[index]}
                                </Text>
                            </View>
                            {stepNumber < totalSteps && (
                                <ProgressLine isCompleted={isCompleted} />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: "#000",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    stepColumn: {
        alignItems: "center",
        gap: 8,
    },
    stepLabel: {
        color: "#666",
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 4,
        maxWidth: 70,
    },
    stepLabelActive: {
        color: "#d4c5f9",
    },
    stepLabelCompleted: {
        color: "#999",
    },
});