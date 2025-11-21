import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { ProfileStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ProfileHeader } from "../molecules/ProfileHeader";
import { QuickSettings } from "../organisms/QuickSettings";
import { TransactionList } from "../organisms/TransactionList";
import { VerificationCard } from "../organisms/VerificationCard";
import { WalletCard } from "../organisms/WalletCard";
import { Transaction } from "../temp";
import { removeAuth } from "../../../authentication/store/slices/authSlice";
import { useAppDispatch } from "../../../authentication/store/hooks";
import { DocumentVerificationHelper } from "../../../../../domain/helpers/DocumentVerificationHelper";
import { useRenterProfile } from "../../hooks/profile/useRenterProfile";
import { useWallet } from "../../hooks/wallet/useWallet";
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
  const { renter, renterResponse, loading: profileLoading, error: profileError, refresh: refreshProfile } = useRenterProfile();
  const { balance, loading: walletLoading, error: walletError, refresh: refreshWallet, createWallet } = useWallet();

  // Mock transactions
  const transactions: Transaction[] = [
    { title: "VinFast Evo200 Rental", date: "Sep 01, 2025", amount: -2670000 },
    { title: "Security Deposit Refund", date: "Aug 27, 2025", amount: 1500000 },
    { title: "Wallet Top-up", date: "Aug 20, 2025", amount: 5000000 },
    { title: "Klara S Rental", date: "Aug 05, 2025", amount: -950000 },
  ];

  const handleEdit = () => navigation.navigate("EditProfile");
  
  const handleAddFunds = () => {
    // TODO: Navigate to add funds screen
    console.log("Add funds");
  };
  

  const handleWithdraw = () => {
    navigation.navigate("CreateWithdrawalRequest");
  };

  const handleManage = () => {
    navigation.navigate("WithdrawalRequestList");
  };
  
  const handleViewAllTransactions = () => {
    // TODO: Navigate to transactions screen
    console.log("View all transactions");
  };
  
  const handleVerify = () => navigation.navigate("EditProfile");
  const handleViewDetails = () => console.log("View verification details");
  const handleInsuranceClaims = () => navigation.navigate("InsuranceClaims");

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => dispatch(removeAuth()),
      },
    ]);
  };

  // Handle wallet retry (for error state)
  const handleWalletRetry = async () => {
    await refreshWallet();
  };

  // Handle refresh (pull-to-refresh)
  const handleRefresh = async () => {
    await Promise.all([refreshProfile(), refreshWallet()]);
  };

  // === LOADING & ERROR STATES (Profile) ===
  if (profileLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (profileError || !renter || !renterResponse) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {profileError || "Profile not found"}</Text>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }

  // === MEMBER SINCE ===
  const memberSince = new Date(renter.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long" }
  );

  // === VERIFICATIONS ===
  const rawVerifications = DocumentVerificationHelper.getAllVerifications(
    renterResponse.documents,
    renterResponse.phone
  );

  const verifications = rawVerifications.map((info) => {
    let icon = "document";
    if (info.label.includes("Citizen") || info.label.includes("ID")) {
      icon = "id-card";
    } else if (info.label.includes("License") || info.label.includes("Driver")) {
      icon = "car";
    } else if (info.label.includes("Phone")) {
      icon = "phone";
    }

    return {
      title: info.label,
      status: info.status as "verified" | "valid" | "needed" | "expired",
      icon,
    };
  });

  // === RENDER ===
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={profileLoading || walletLoading}
            onRefresh={handleRefresh}
            tintColor="#00ff00"
            colors={["#00ff00"]}
          />
        }
      >
        <ProfileHeader
          name={renter.account?.fullname || renter.email}
          avatar={renter.avatarUrl}
          documents={renterResponse.documents}
          memberSince={memberSince}
          trips="0"
          distance="0km"
          onEdit={handleEdit}
        />
        <WalletCard
          balance={balance}
          loading={walletLoading}
          error={walletError}
          onAddFunds={handleAddFunds}
          onWithdraw={handleWithdraw}
          onManage={handleManage}
          onRetry={handleWalletRetry}
        />
        <TransactionList
          transactions={transactions}
          onViewAll={handleViewAllTransactions}
        />
        <VerificationCard
          verifications={verifications}
          onVerify={handleVerify}
        />
        <QuickSettings 
          onSignOut={handleSignOut}
          onInsuranceClaims={handleInsuranceClaims}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    marginBottom: 16,
  },
});