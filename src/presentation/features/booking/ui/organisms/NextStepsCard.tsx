import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NextStepItem } from "../molecules/phase4/NextStepItem";

export const NextStepsCard: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Next Steps</Text>
            <NextStepItem
                number={1}
                title="Contract is ready for digital signature"
                description="You'll need to review and sign the contract"
            />
            <NextStepItem
                number={2}
                title="You will receive an OTP code to complete signing"
                description="OTP will be sent to your registered mobile number"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
});
