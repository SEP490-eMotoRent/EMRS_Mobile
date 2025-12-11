import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { DocumentResponse, MembershipResponse } from "../../../../../data/models/account/renter/RenterResponse";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icons/Icons";
import { MembershipBadge, MembershipTier } from "../atoms/Badges/MembershipBadge";

interface ProfileHeaderProps {
  name: string;
  memberSince: string;
  trips: string;
  documents: DocumentResponse[];
  distance: string;
  avatar: string;
  membership?: MembershipResponse | null;
  onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  memberSince,
  trips,
  distance,
  avatar,
  documents,
  membership,
  onEdit,
}) => {
  const membershipTier = (membership?.tierName?.toUpperCase() || "BRONZE") as MembershipTier;
  const discountPercentage = membership?.discountPercentage || 0;

  // Determine membership color based on tier
  const getMembershipColor = () => {
    switch (membershipTier) {
      case "BRONZE":
        return "#CD7F32";
      case "SILVER":
        return "#C0C0C0";
      case "GOLD":
        return "#FFD700";
      case "PLATINUM":
        return "#E5E4E2";
      default:
        return "#CD7F32";
    }
  };

  return (
    <View style={styles.profileHeader}>
      {/* Account Verification Badge */}
      {documents.length === 0 && (
        <View style={styles.verificationBadge}>
          <Badge type="error">Cần Xác Thực Tài Khoản</Badge>
        </View>
      )}

      <View style={styles.topSection}>
        {/* Avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameAndEditRow}>
            <View style={styles.nameWithBadge}>
              <Text style={styles.profileName} numberOfLines={1}>
                {name}
              </Text>
              {/* Compact Membership Badge */}
              <View style={[styles.compactBadge, { borderColor: getMembershipColor() }]}>
                <FontAwesome5 
                  name="medal" 
                  size={10} 
                  color={getMembershipColor()} 
                />
                <Text style={[styles.badgeText, { color: getMembershipColor() }]}>
                  {membershipTier}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Icon name="edit" />
            </TouchableOpacity>
          </View>

          {/* Member Since */}
          <Text style={styles.memberSince}>
            Thành viên kể từ: {memberSince}
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <FontAwesome5 name="car" size={14} color="#fff" style={styles.statIcon} />
          <Text style={styles.statText}>{trips} chuyến</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <FontAwesome5 name="map-marker-alt" size={14} color="#fff" style={styles.statIcon} />
          <Text style={styles.statText}>{distance}</Text>
        </View>
      </View>

      {/* Membership Discount Banner */}
      {discountPercentage > 0 && (
        <View style={styles.discountBanner}>
          <FontAwesome5 name="gift" size={14} color="#22c55e" style={styles.discountIcon} />
          <Text style={styles.discountText}>
            Giảm {discountPercentage}% mỗi lần đặt xe
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    padding: 20,
    backgroundColor: "#000",
  },
  verificationBadge: {
    marginBottom: 16,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  avatarPlaceholder: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameAndEditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nameWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    flexWrap: "wrap",
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginRight: 8,
  },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  memberSince: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    marginRight: 6,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#333",
    marginHorizontal: 8,
  },
  discountBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a2e1a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#22c55e40",
  },
  discountIcon: {
    marginRight: 8,
  },
  discountText: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "600",
  },
});