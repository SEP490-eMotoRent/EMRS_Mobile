import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../common/theme/colors";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
type NavProp = StackNavigationProp<TripStackParamList, "ReturnComplete">;
type RouteP = RouteProp<TripStackParamList, "ReturnComplete">;

export const ReturnCompleteScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteP>();
  //   const { finalizeData, summary } = route.params;
//   const finalizeData = {}

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + " VND";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

//   const refundAmount =
//     finalizeData?.paymentResult?.refundAmount ?? summary?.refundAmount ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header with Success Icon */}
        <View style={styles.header}>
          <Text style={styles.title}>Return Complete!</Text>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconCircle}>
              <AntDesign name="check" size={32} color="#22C55E" />
            </View>
          </View>
          <Text style={styles.successMessage}>
            Vehicle successfully returned
          </Text>
          <Text style={styles.timestamp}>
            {/* {finalizeData?.actualReturnDatetime
              ? formatDate(finalizeData.actualReturnDatetime)
              : formatDate(new Date().toISOString())} */}
          </Text>
        </View>

        {/* Completion Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Completion Summary</Text>

          <View style={styles.userRow}>
            <View style={styles.avatarContainer}>
              <AntDesign name="user" size={24} color={colors.text.secondary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>John Nguyen</Text>
              <Text style={styles.vehicleInfo}>
                VinFast Evo200 - 59X1-12345
              </Text>
            </View>
          </View>

          <View style={styles.handoverStatusRow}>
            <View style={styles.checkmarkCircle}>
              <AntDesign name="check" size={12} color="#22C55E" />
            </View>
            <Text style={styles.handoverStatusText}>
              Great job! Another successful handover
            </Text>
          </View>

          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>Customer feedback</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <AntDesign key={i} name="star" size={16} color="#FBBF24" />
              ))}
            </View>
            <Text style={styles.feedbackTime}>
              Customer approved at{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        {/* Financial Settlement Card */}
        <View style={[styles.card, styles.financialCard]}>
          <Text style={styles.cardHeader}>Financial Settlement</Text>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Refund Processed</Text>
            {/* <Text style={styles.refundAmount}>{formatVnd(refundAmount)}</Text> */}
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Method</Text>
            <Text style={styles.financialValue}>
              {/* {finalizeData?.paymentResult?.transactionType === "WALLET"
                ? "Auto-refunded to Wallet"
                : "Wallet Refund"} */}
            </Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Status</Text>
            <View style={styles.statusRow}>
              <View style={styles.checkmarkCircleSmall}>
                <AntDesign name="check" size={10} color="#22C55E" />
              </View>
              <Text style={styles.completedText}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Next Steps Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Next Steps</Text>

          <View style={styles.stepsRow}>
            <Text style={styles.stepsLabel}>Vehicle Status</Text>
            <View style={styles.availableBadge}>
              <Text style={styles.availableBadgeText}>
                Available for next rental
              </Text>
            </View>
          </View>

          <View style={styles.stepsRow}>
            <Text style={styles.stepsLabel}>Active rentals</Text>
            <Text style={styles.stepsValue}>0</Text>
          </View>

          <View style={styles.stepsRow}>
            <Text style={styles.stepsLabel}>Next Reservation</Text>
            <Text style={styles.stepsValue}>Sep 22, 2:30 PM</Text>
          </View>
        </View>

        {/* Feedback Banner */}
        <View style={styles.feedbackBanner}>
          <Text style={styles.feedbackBannerText}>
            Great job! Another successful return.
          </Text>
          <View style={styles.feedbackRatingRow}>
            <AntDesign name="star" size={12} color="#FBBF24" />
            <Text style={styles.feedbackRatingText}>
              Customer feedback: 4.90
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.secondaryButton}
        //   onPress={() =>
        //     navigation.navigate("BookingDetails", {
        //       bookingId: route.params.bookingId,
        //     })
        //   }
        >
          <AntDesign name="file-text" size={18} color={colors.text.primary} />
          <Text style={styles.secondaryButtonText}>View Full Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Trip")}
        >
          <AntDesign name="home" size={18} color="#000" />
          <Text style={styles.primaryButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#052e1a",
    borderWidth: 3,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  successMessage: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  timestamp: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  financialCard: {
    backgroundColor: "#052e1a",
    borderColor: "#16A34A",
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  vehicleInfo: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  handoverStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#052e1a",
    borderWidth: 1,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  handoverStatusText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  feedbackRow: {
    marginTop: 12,
  },
  feedbackLabel: {
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  feedbackTime: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  financialLabel: {
    color: colors.text.primary,
    fontSize: 14,
  },
  refundAmount: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "700",
  },
  financialValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkmarkCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#052e1a",
    borderWidth: 1,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  completedText: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "700",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stepsLabel: {
    color: colors.text.primary,
    fontSize: 14,
  },
  availableBadge: {
    backgroundColor: "#052e1a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  availableBadgeText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "700",
  },
  stepsValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  feedbackBanner: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
  feedbackBannerText: {
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: 6,
  },
  feedbackRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  feedbackRatingText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
