import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import sl from "../../../../../core/di/InjectionContainer";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { AntDesign } from "@expo/vector-icons";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { colors } from "../../../../common/theme/colors";
import { GetContractUseCase } from "../../../../../domain/usecases/contract/GetContractUseCase";
import { RentalContract } from "../../../../../domain/entities/booking/RentalContract";
import { GenerateOtpContractUseCase } from "../../../../../domain/usecases/contract/GenerateOtpContractUseCase";
import { SignContractUseCase } from "../../../../../domain/usecases/contract/SignContractUseCase";

type SignContractScreenRouteProp = RouteProp<
  TripStackParamList,
  "SignContract"
>;

type SignContractScreenNavigationProp = any;

export const SignContractScreen: React.FC = () => {
  const route = useRoute<SignContractScreenRouteProp>();
  const navigation = useNavigation<SignContractScreenNavigationProp>();
  const { bookingId, email, fullName } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [contract, setContract] = useState<RentalContract | null>(null);
  const [hasRequestedOtp, setHasRequestedOtp] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const maskedEmail = email
    ? `***${email.split("@")[0].slice(-4)}@${email.split("@")[1]}`
    : "***xxxx";
  const otpRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    fetchContract();
  }, [bookingId]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const getContractUseCase = new GetContractUseCase(
        sl.get("ReceiptRepository")
      );
      const contract = await getContractUseCase.execute(bookingId);
      setContract(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
    } finally {
      setLoading(false);
    }
  };

  // OTP input logic
  const handleChange = (index: number, value: string) => {
    let newVal = value.replace(/[^0-9]/g, "");
    // auto-next on entry
    const next = [...otp];
    next[index] = newVal;
    setOtp(next);
    if (newVal.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    // handle backspace: if input is empty and user presses backspace, go to previous
    if (newVal.length === 0 && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const generateOtpUseCase = new GenerateOtpContractUseCase(
        sl.get("ReceiptRepository")
      );
      const response = await generateOtpUseCase.execute(contract?.id || "");
      if (response.success) {
        Alert.alert(
          "Thành công",
          "Mã OTP đã được gửi đến email đã đăng ký của bạn"
        );
        setHasRequestedOtp(true);
        setResendSeconds(60);
      } else {
        Alert.alert("Lỗi", response.message || "Failed to send OTP");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setInterval(() => {
      setResendSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSeconds]);

  const handleSign = async () => {
    // setSubmitting(true);
    // setTimeout(() => {
    //   setSubmitting(false);
    //   navigation.goBack();
    // }, 1200);
    try {
      setSubmitting(true);
      const signContractUseCase = new SignContractUseCase(
        sl.get("ReceiptRepository")
      );
      const response = await signContractUseCase.execute(
        contract?.id || "",
        otp.join("")
      );
      if (response.success) {
        Alert.alert("Thành công", "Hợp đồng đã được ký thành công");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", response.message || "Failed to sign contract");
      }
    } catch (error) {
      console.error("Error signing contract:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <ScreenHeader
          title="Ký hợp đồng kỹ thuật số"
          subtitle={`Người ký: ${fullName}`}
          onBack={() => navigation.goBack()}
        />

        {/* Contract Card */}
        <View style={styles.card}>
          {/* <View style={styles.cardHeaderRow}>
            <View style={styles.previewRow}>
              {booking?.vehicle?.fileUrl?.map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.preview}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>

          <Text style={styles.vehicleName}>
            {booking?.vehicleModel?.modelName || "VinFast Evo200"}
          </Text>
          <Text style={styles.dates}>
            Sep 01 - Sep 07, 2025{"\n"}7 days 4 hours
          </Text>

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
          </View> */}

          {/* Contract PDF */}
          {contract?.contractPdfUrl ? (
            <View style={styles.webviewWrap}>
              <WebView
                source={{ uri: contract.contractPdfUrl }}
                originWhitelist={["*"]}
                style={styles.webview}
                automaticallyAdjustContentInsets
                javaScriptEnabled
                domStorageEnabled
              />
            </View>
          ) : null}

          <Text style={styles.termsTitle}>Điều khoản & chính sách</Text>

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, checked && styles.checkboxChecked]}
              onPress={() => setChecked((prev) => !prev)}
            >
              {checked && <AntDesign name="check" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              Tôi đã đọc và đồng ý với tất cả các{" "}
              <Text
                style={styles.termsButton}
                onPress={() => setTermsVisible(true)}
              >
                Điều khoản & chính sách
              </Text>
            </Text>
          </View>
        </View>

        {/* Terms Modal */}
        <Modal
          visible={termsVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTermsVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Điều khoản & chính sách</Text>
                <TouchableOpacity
                  onPress={() => setTermsVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <AntDesign name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator>
                <Text style={styles.modalParagraph}>
                  1. Bên thuê đồng ý thuê Xe được xác định ở trên trong thời hạn
                  và theo mức giá đã nêu. Bên thuê có trách nhiệm tuân thủ tất
                  cả các quy định của hợp đồng và pháp luật hiện hành.
                </Text>
                <Text style={styles.modalParagraph}>
                  2. Bên thuê xác nhận rằng Xe đang trong tình trạng tốt tại
                  thời điểm nhận xe. Mọi hư hỏng (nếu có) phải được ghi nhận
                  bằng biên bản/hình ảnh trước khi bàn giao.
                </Text>
                <Text style={styles.modalParagraph}>
                  3. Bảo hiểm và trách nhiệm: Bên thuê chịu trách nhiệm đối với
                  mọi thiệt hại phát sinh do lỗi của mình trong quá trình sử
                  dụng xe theo phạm vi quy định của hợp đồng.
                </Text>
                <Text style={styles.modalParagraph}>
                  4. Thanh toán: Các khoản phí thuê, đặt cọc và phụ phí (nếu có)
                  phải được thanh toán đầy đủ theo kỳ hạn đã thỏa thuận.
                </Text>
                <Text style={styles.modalParagraph}>
                  5. Chấm dứt: Hợp đồng có thể bị chấm dứt theo các điều kiện
                  quy định, bao gồm nhưng không giới hạn ở việc vi phạm nghĩa vụ
                  hợp đồng hoặc yêu cầu từ cơ quan có thẩm quyền.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => setTermsVisible(false)}
              >
                <Text style={styles.modalPrimaryBtnTxt}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Next Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Next Steps</Text>
          <View style={styles.stepRow}>
            <View style={styles.bubbleActive}>
              <Text style={styles.bubbleTxt}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepText}>Hợp đồng đã sẵn sàng để ký số</Text>
              <Text style={styles.stepSub}>Bạn cần xem xét và ký hợp đồng</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleTxt}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepText}>
                Bạn sẽ nhận được mã OTP để hoàn thành việc ký
              </Text>
              <Text style={styles.stepSub}>
                Mã OTP sẽ được gửi đến email đã đăng ký của bạn
              </Text>
            </View>
          </View>
        </View>

        {/* OTP Section */}
        <View style={styles.otpSection}>
          <Text style={styles.otpTitle}>Nhập mã OTP</Text>
          <Text style={styles.otpDesc}>
            Chúng tôi đã gửi mã 6 chữ số đến email đã đăng ký của bạn kết thúc
            bằng {maskedEmail}
          </Text>
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => {
                  otpRefs.current[i] = ref;
                }}
                value={digit}
                onChangeText={(val) => handleChange(i, val)}
                keyboardType="numeric"
                maxLength={1}
                style={styles.otpInput}
                autoFocus={false}
                returnKeyType="next"
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !otp[i] && i > 0) {
                    otpRefs.current[i - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>
          {!hasRequestedOtp ? (
            <TouchableOpacity
              style={[styles.sendOtpBtn, loading && { opacity: 0.6 }]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#19141C" />
              ) : (
                <Text style={styles.sendOtpBtnTxt}>Gửi OTP</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={loading || resendSeconds > 0}
            >
              <Text
                style={[
                  styles.resendOtp,
                  (loading || resendSeconds > 0) && { opacity: 0.6 },
                ]}
              >
                {resendSeconds > 0
                  ? `Gửi lại mã OTP (${resendSeconds}s)`
                  : "Gửi lại mã OTP"}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.otpInfoRow}>
            <AntDesign name="lock" size={16} color="#C9B6FF" />
            <Text style={styles.otpInfo}>
              Mã OTP này là bắt buộc để hoàn thành việc ký số của bạn
            </Text>
          </View>
          <View style={styles.otpInfoRow}>
            <AntDesign
              name="warning"
              size={16}
              color="#FFD666"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.otpDanger}>
              Đừng chia sẻ mã này với bất kỳ ai
            </Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[
            styles.signBtn,
            (!checked || otp.some((v) => !v) || submitting) &&
              styles.signBtnDisabled,
          ]}
          onPress={handleSign}
          disabled={!checked || otp.some((v) => !v) || submitting}
        >
          <Text style={styles.signBtnTxt}>
            {submitting ? "Đang ký..." : "Ký hợp đồng"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnTxt}>Hủy đặt xe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  headerRowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  headerContract: { color: "#fff", fontWeight: "700", fontSize: 12 },

  card: {
    backgroundColor: "#19141C",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2235",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  previewRow: { flexDirection: "row", alignItems: "center" },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#140E1E",
    marginRight: 8,
  },

  vehicleName: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 6 },
  dates: { color: "#C9B6FF", marginBottom: 14, marginTop: 2, fontSize: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaGrey: { color: "#857FA2", fontSize: 12 },
  metaVal: { color: "#fff", fontSize: 12 },
  metaAmount: { color: "#FFD666", fontWeight: "700" },

  termsTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 8,
  },
  termsPanel: { backgroundColor: "#140E1E", borderRadius: 10, padding: 12 },
  termsTxt: { color: "#fff", fontSize: 12, marginBottom: 4 },
  scrollThumb: {
    width: 8,
    height: 36,
    backgroundColor: "#6E57D1",
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 6,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#19141C",
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#C9B6FF", borderColor: "#C9B6FF" },
  checkboxLabel: { color: "#fff", fontSize: 12 },

  stepsCard: {
    backgroundColor: "#19141C",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  stepsTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
    fontSize: 14,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  bubble: {
    backgroundColor: "#39344D",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleActive: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleTxt: { color: "#fff", fontWeight: "700" },
  stepText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  stepSub: { color: "#857FA2", fontSize: 11 },

  otpSection: { marginTop: 6 },
  otpTitle: { color: "#fff", fontWeight: "700", fontSize: 15, marginBottom: 6 },
  otpDesc: { color: "#857FA2", fontSize: 12, marginBottom: 12 },
  sendOtpBtn: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  sendOtpBtnTxt: {
    fontSize: 16,
    lineHeight: 20,
    color: "#19141C",
    fontWeight: "700",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: "#19141C",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#39344D",
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  resendOtp: {
    color: "#C9B6FF",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
    textAlign: "center",
  },
  otpInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  otpInfo: { color: "#C9B6FF", fontSize: 12 },
  otpDanger: { color: "#FFD666", fontSize: 12 },

  signBtn: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  signBtnTxt: { color: "#19141C", fontWeight: "700", fontSize: 15 },
  signBtnDisabled: { backgroundColor: "#82799f" },
  cancelBtn: {
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "#FF4D4F",
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelBtnTxt: { color: "#FFFFFF", fontWeight: "700" },
  webviewWrap: {
    height: 500,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0F0A18",
    marginTop: 8,
    marginBottom: 12,
  },
  webview: { flex: 1 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#19141C",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#2A2235",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A2235",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: { marginTop: 8 },
  modalParagraph: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  modalPrimaryBtn: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  modalPrimaryBtnTxt: { color: "#19141C", fontWeight: "700" },
  termsButton: {
    color: "#C9B6FF",
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
