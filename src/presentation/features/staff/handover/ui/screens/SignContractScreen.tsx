import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../../common/theme/colors";

// Route: receives { contract, booking, userPhone, ... } as params
export const SignContractScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { contract, booking, userPhone } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [checked, setChecked] = useState(false);
  const maskedPhone = userPhone ? `***${userPhone.slice(-4)}` : "***xxxx";
  // OTP input logic
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const next = [...otp];
    next[index] = value.replace(/[^0-9]/g, "");
    setOtp(next);
  };

  const handleSign = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigation.goBack(); // Later: result screen
    }, 1500);
  };

  React.useEffect(() => {
    if (otp.join("").length === 6) {
      // Optionally auto-submit
    }
  }, [otp]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0A18" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Contract info */}
          <View style={styles.headerRow}>
            <AntDesign name="filetext1" size={20} color="#C9B6FF" />
            <Text style={styles.contractNumber}>{contract?.contractNumber || "CONTRACT-EMR-xxxxx"}</Text>
          </View>
          <Text style={styles.vehicleName}>{booking?.vehicleModel?.modelName || "VinFast Evo200"}</Text>
          <Text style={styles.dates}>Sep 01 - Sep 07, 2025\n7 days 4 hours</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.metaGrey}>Pickup Location</Text>
            <Text style={styles.metaVal}>District 2, eMotoRent Branch</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.metaGrey}>Total Amount</Text>
            <Text style={styles.metaAmount}>2,670,000đ</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.metaGrey}>Security Deposit</Text>
            <Text style={styles.metaVal}>2,000,000đ (refundable)</Text>
          </View>
          {/* Terms Highlights */}
          <Text style={styles.termsTitle}>Terms Highlights</Text>
          <View style={styles.termsPanel}>
            <Text style={styles.termsTxt}>1. RENTAL TERMS: Lessee agrees to rent the Vehicle identified above for the period and at the rate indicated.</Text>
            <Text style={styles.termsTxt}>2. CONDITION OF VEHICLE: Lessee acknowledges that the Vehicle is in good condition. Lessee will...</Text>
          </View>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, checked && styles.checkboxChecked]}
              onPress={() => setChecked((prev) => !prev)}
            >
              {checked && <AntDesign name="check" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>I have read and agree to all terms</Text>
          </View>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Next Steps</Text>
          <View style={styles.stepRow}>
            <View style={styles.bubbleActive}><Text style={styles.bubbleTxt}>1</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepText}>Contract is ready for digital signature</Text>
              <Text style={styles.stepSub}>You'll need to review and sign the contract</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.bubble}><Text style={styles.bubbleTxt}>2</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepText}>You will receive an OTP code to complete signing</Text>
              <Text style={styles.stepSub}>OTP will be sent to your registered mobile number</Text>
            </View>
          </View>
        </View>

        {/* OTP section */}
        <View style={styles.otpSection}>
          <Text style={styles.otpTitle}>Enter OTP Code</Text>
          <Text style={styles.otpDesc}>
            We've sent a 6-digit code to your registered phone number ending in {maskedPhone}
          </Text>
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                value={digit}
                onChangeText={(val) => handleChange(i, val)}
                keyboardType="numeric"
                maxLength={1}
                style={styles.otpInput}
                autoFocus={i === 0}
                returnKeyType="next"
              />
            ))}
          </View>
          <TouchableOpacity>
            <Text style={styles.resendOtp}>Resend OTP code</Text>
          </TouchableOpacity>
          <View style={styles.otpInfoRow}>
            <AntDesign name="lock" size={16} color="#C9B6FF" />
            <Text style={styles.otpInfo}>This OTP is required to complete your digital signature</Text>
          </View>
          <View style={styles.otpInfoRow}>
            <AntDesign name="warning" size={16} color="#FFD666" style={{ marginRight: 4 }} />
            <Text style={styles.otpDanger}>Do not share this code with anyone</Text>
          </View>
        </View>

        {/* Sign Button */}
        <TouchableOpacity
          style={[styles.signBtn, (!checked || otp.some(v => !v) || submitting) && styles.signBtnDisabled]}
          onPress={handleSign}
          disabled={!checked || otp.some(v => !v) || submitting}
        >
          <Text style={styles.signBtnTxt}>{submitting ? "Signing..." : "Sign Contract"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnTxt}>Cancel Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#0F0A18" },
  card: {
    backgroundColor: "#19141C",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  contractNumber: { fontWeight: "700", color: "#C9B6FF", fontSize: 15 },
  vehicleName: { color: "#fff", fontSize: 18, fontWeight: "700" },
  dates: { color: "#C9B6FF", marginBottom: 14, marginTop: 2, fontSize: 13 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  metaGrey: { color: "#857FA2", fontSize: 12 },
  metaVal: { color: "#fff", fontSize: 12 },
  metaAmount: { color: "#FFD666", fontWeight: "700" },
  termsTitle: { color: "#fff", fontWeight: "700", fontSize: 15, marginTop: 16, marginBottom: 8 },
  termsPanel: { backgroundColor: "#140E1E", borderRadius: 10, padding: 12, marginBottom: 4 },
  termsTxt: { color: "#fff", fontSize: 12, marginBottom: 2 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: "#19141C", borderWidth: 1, borderColor: "#fff", alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: "#C9B6FF", borderColor: "#C9B6FF" },
  checkboxLabel: { color: "#fff", marginLeft: 4, fontSize: 12 },
  stepsCard: { backgroundColor: "#19141C", borderRadius: 16, padding: 16, marginBottom: 16 },
  stepsTitle: { color: "#fff", fontWeight: "bold", marginBottom: 12, fontSize: 15 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  bubble: { backgroundColor: "#39344D", borderRadius: 12, width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  bubbleActive: { backgroundColor: "#C9B6FF", borderRadius: 12, width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  bubbleTxt: { color: "#fff", fontWeight: "700" },
  stepText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  stepSub: { color: "#857FA2", fontSize: 11 },
  otpSection: { marginTop: 10 },
  otpTitle: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  otpDesc: { color: "#857FA2", fontSize: 12, marginBottom: 12 },
  otpRow: { flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 8 },
  otpInput: { width: 40, height: 44, backgroundColor: "#19141C", borderRadius: 10, borderWidth: 1, borderColor: "#39344D", fontSize: 20, fontWeight: "700", color: "#fff", textAlign: "center" },
  resendOtp: { color: "#C9B6FF", fontSize: 12, alignSelf: "center", marginTop: 6, marginBottom: 8 },
  otpInfoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  otpInfo: { color: "#C9B6FF", fontSize: 12 },
  otpDanger: { color: "#FFD666", fontSize: 12 },
  signBtn: { backgroundColor: "#C9B6FF", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 20 },
  signBtnTxt: { color: "#19141C", fontWeight: "bold", fontSize: 15 },
  signBtnDisabled: { backgroundColor: "#82799f" },
  cancelBtn: { alignItems: "center", marginTop: 14 },
  cancelBtnTxt: { color: "#FFD666", fontWeight: "700" },
});

