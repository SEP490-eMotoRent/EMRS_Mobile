import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DocumentVerificationHelper } from "../../../../../domain/helpers/DocumentVerificationHelper";
import { ProfileStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { useAppDispatch } from "../../../authentication/store/hooks";
import { removeAuth } from "../../../authentication/store/slices/authSlice";
import { useRenterProfile } from "../../hooks/profile/useRenterProfile";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import { useWallet } from "../../hooks/wallet/useWallet";
import { ProfileHeader } from "../molecules/ProfileHeader";
import { QuickSettings } from "../organisms/QuickSettings";
import { TransactionList } from "../organisms/TransactionList";
import { VerificationCard } from "../organisms/VerificationCard";
import { WalletCard } from "../organisms/WalletCard";
import { TransactionTypeHelper } from "../../../../../domain/helpers/TransactionTypeHelper";

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  "Profile"
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    renter, 
    renterResponse, 
    loading: profileLoading, 
    error: profileError, 
    refresh: refreshProfile,
    membership,
  } = useRenterProfile();
  const { 
    balance, 
    loading: walletLoading, 
    error: walletError, 
    refresh: refreshWallet 
  } = useWallet();
  const { 
    transactions: transactionEntities, 
    loading: transactionsLoading, 
    error: transactionsError,
    refresh: refreshTransactions 
  } = useTransactions();

  const handleEdit = () => navigation.navigate("EditProfile");
  
  const handleAddFunds = () => {
      navigation.navigate("WalletTopUp");
  };

  const handleWithdraw = () => {
    navigation.navigate("CreateWithdrawalRequest");
  };

  const handleManage = () => {
    navigation.navigate("WithdrawalRequestList");
  };
  
  const handleViewAllTransactions = () => {
      navigation.navigate("AllTransactions");
  };
  
  const handleVerify = () => navigation.navigate("EditProfile");
  const handleInsuranceClaims = () => navigation.navigate("InsuranceClaims");

  const handleSignOut = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => dispatch(removeAuth()),
      },
    ]);
  };

  const handleWalletRetry = async () => {
    await refreshWallet();
  };

  const handleRefresh = async () => {
    await Promise.all([
      refreshProfile(), 
      refreshWallet(), 
      refreshTransactions()
    ]);
  };

  // === LOADING & ERROR STATES ===
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
        <Text style={styles.errorText}>Lỗi: {profileError || "Không tìm thấy hồ sơ"}</Text>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }

  // === MEMBER SINCE ===
  const memberSince = new Date(renter.createdAt || Date.now()).toLocaleDateString(
    "vi-VN",
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

  // === MAP TRANSACTIONS TO UI FORMAT ===
  const transactions = transactionEntities.map(t => ({
      title: TransactionTypeHelper.toVietnamese(t.transactionType),
      date: new Date(t.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }),
      amount: t.amount,
  }));

  // === RENDER ===
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={profileLoading || walletLoading || transactionsLoading}
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
          membership={membership}
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
          limit={5}
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