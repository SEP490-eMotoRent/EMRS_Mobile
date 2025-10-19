import React from "react";
import { StyleSheet, View } from "react-native";
import { OTPInput } from "../../atoms/input/OTPInput";

interface OTPInputGroupProps {
    values: string[];
}

export const OTPInputGroup: React.FC<OTPInputGroupProps> = ({ values }) => {
    return (
        <View style={styles.container}>
            {values.map((value, index) => (
                <OTPInput key={index} value={value} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
        marginBottom: 16,
    },
});
