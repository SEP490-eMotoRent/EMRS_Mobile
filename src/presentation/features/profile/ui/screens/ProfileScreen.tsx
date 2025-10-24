import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  ProfileStackParamList,
  RootStackParamList,
} from "../../../../shared/navigation/StackParameters/types";
import { ProfileHeader } from "../molecules/ProfileHeader";
import { QuickSettings } from "../organisms/QuickSettings";
import { TransactionList } from "../organisms/TransactionList";
import { VerificationCard } from "../organisms/VerificationCard";
import { WalletCard } from "../organisms/WalletCard";
import { Transaction, Verification } from "../temp";
import { removeAuth } from "../../../authentication/store/slices/authSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../authentication/store/hooks";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  "Profile"
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const transactions: Transaction[] = [
    { title: "VinFast Evo200 Rental", date: "Sep 01, 2025", amount: -2670000 },
    { title: "Security Deposit Refund", date: "Aug 27, 2025", amount: 1500000 },
    { title: "Wallet Top-up", date: "Aug 20, 2025", amount: 5000000 },
    { title: "Klara S Rental", date: "Aug 05, 2025", amount: -950000 },
  ];

  const verifications: Verification[] = [
    { label: "ID verification", status: "verified" },
    { label: "Driver's license", status: "valid", validUntil: "2027" },
    { label: "Phone Number", status: "needed" },
  ];

  const handleEdit = (): void => {
    navigation.navigate("EditProfile");
  };

  const handleAddFunds = (): void => {
    console.log("Add funds");
  };

  const handleWithdraw = (): void => {
    console.log("Withdraw money");
  };

  const handleManage = (): void => {
    console.log("Manage wallet");
  };

  const handleViewAllTransactions = (): void => {
    console.log("View all transactions");
  };

  const handleVerify = (): void => {
    console.log("Start verification");
  };

  const handleViewDetails = (): void => {
    console.log("View verification details");
  };

  const handleSignOut = (): void => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          dispatch(removeAuth());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name="John Nguyen"
          memberSince="March 2024"
          trips="12"
          distance="850km"
          onEdit={handleEdit}
        />
        <WalletCard
          balance={5000000}
          onAddFunds={handleAddFunds}
          onWithdraw={handleWithdraw}
          onManage={handleManage}
        />
        <TransactionList
          transactions={transactions}
          onViewAll={handleViewAllTransactions}
        />
        <VerificationCard
          verifications={verifications}
          onVerify={handleVerify}
          onViewDetails={handleViewDetails}
        />
        <QuickSettings onSignOut={handleSignOut} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
});
