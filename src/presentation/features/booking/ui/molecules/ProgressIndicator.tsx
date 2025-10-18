import React from "react";
import { StyleSheet, View } from "react-native";
import { ProgressDot } from "../atoms/indicators/ProgressDot";
import { ProgressLine } from "../atoms/indicators/ProgressLine";

interface ProgressIndicatorProps {
    currentStep: number; // 1, 2, 3, or 4
    totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
    currentStep,
    totalSteps
}) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <React.Fragment key={stepNumber}>
                        <ProgressDot isActive={isActive} isCompleted={isCompleted} />
                        {stepNumber < totalSteps && (
                            <ProgressLine isCompleted={isCompleted} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
});
