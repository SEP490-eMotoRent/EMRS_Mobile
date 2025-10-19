import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OTPInputGroup } from "../molecules/phase4/OTPInputGroup";

interface OTPVerificationProps {
    phoneNumber: string;
    onResend: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ phoneNumber, onResend }) => {
    const [otpValues, setOtpValues] = useState(["3", "2", "", "", "", ""]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP Code</Text>
            <Text style={styles.subtitle}>
                We've sent a 6-digit code to your registered phone number ending in {phoneNumber}
            </Text>
            
            <OTPInputGroup values={otpValues} />
            
            <TouchableOpacity style={styles.resendButton} onPress={onResend}>
                <Text style={styles.resendText}>Resend OTP code</Text>
            </TouchableOpacity>
            
            <Text style={styles.helpText}>
                Didn't receive code? Check SMS or call support
            </Text>
            
            <View style={styles.notices}>
                <View style={styles.notice}>
                    <View style={styles.noticeIcon}>
                        <Text style={styles.noticeIconText}>ⓘ</Text>
                    </View>
                    <Text style={styles.noticeText}>
                        This OTP is required to complete your digital signature
                    </Text>
                </View>
                <View style={styles.notice}>
                    <View style={styles.noticeIcon}>
                        <Text style={styles.noticeIconText}>ⓘ</Text>
                    </View>
                    <Text style={styles.noticeText}>
                        Do not share this code with anyone
                    </Text>
                </View>
            </View>
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
        marginBottom: 8,
    },
    subtitle: {
        color: "#999",
        fontSize: 13,
        marginBottom: 20,
        lineHeight: 20,
    },
    resendButton: {
        alignItems: "center",
        paddingVertical: 8,
        marginBottom: 8,
    },
    resendText: {
        color: "#d4c5f9",
        fontSize: 14,
        fontWeight: "600",
    },
    helpText: {
        color: "#666",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 20,
    },
    notices: {
        gap: 12,
    },
    notice: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    noticeIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#666",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    noticeIconText: {
        color: "#666",
        fontSize: 12,
    },
    noticeText: {
        color: "#999",
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
    },
});
