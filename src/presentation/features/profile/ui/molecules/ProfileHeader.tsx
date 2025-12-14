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
  distance: string; // Now expects just the number (e.g., "0", "150")
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

  // ✅ Format distance with proper spacing
  const formattedDistance = `${distance} km`;

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
              {/* Improved Membership Badge */}
              <View style={[styles.compactBadge, { borderColor: getMembershipColor() }]}>
                <FontAwesome5 
                  name="medal" 
                  size={11} 
                  color={getMembershipColor()} 
                />
                <Text style={[styles.badgeText, { color: getMembershipColor() }]}>
                  {membershipTier}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={onEdit} 
              style={styles.editButton}
              activeOpacity={0.7}
            >
              <Icon name="edit" />
            </TouchableOpacity>
          </View>

          {/* Member Since - Improved spacing */}
          <Text style={styles.memberSince}>
            Thành viên kể từ: {memberSince}
          </Text>
        </View>
      </View>

      {/* Stats Row - Improved design */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <FontAwesome5 name="car" size={16} color="#fff" style={styles.statIcon} />
          <Text style={styles.statText}>{trips} chuyến</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <FontAwesome5 name="map-marker-alt" size={16} color="#fff" style={styles.statIcon} />
          {/* ✅ Now with proper spacing */}
          <Text style={styles.statText}>{formattedDistance}</Text>
        </View>
      </View>

      {/* Membership Discount Banner - Improved design */}
      {discountPercentage > 0 && (
        <View style={styles.discountBanner}>
          <FontAwesome5 name="gift" size={16} color="#22c55e" style={styles.discountIcon} />
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
    marginBottom: 20, // Increased from 16 for better spacing
  },
  avatar: {
    width: 72, // Slightly larger for better visual weight
    height: 72,
    borderRadius: 36,
    marginRight: 16,
    // Add subtle border for better definition
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  avatarPlaceholder: {
    backgroundColor: "#1a1a1a", // Darker for better contrast
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 30, // Slightly larger
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
    marginRight: 12, // Increased for better spacing
    flexWrap: "wrap",
  },
  profileName: {
    color: "#fff",
    fontSize: 22, // Slightly smaller for better balance with badge
    fontWeight: "700",
    marginRight: 10, // Increased spacing
    letterSpacing: -0.5, // Tighter letter spacing for cleaner look
  },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10, // Slightly more padding
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5, // Thicker border for better visibility
    backgroundColor: "rgba(0,0,0,0.5)", // Slightly more opaque
    gap: 5,
  },
  badgeText: {
    fontSize: 11, // Slightly larger
    fontWeight: "700",
    letterSpacing: 0.8, // More letter spacing for premium feel
  },
  editButton: {
    width: 40, // Slightly larger touch target
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a", // Darker for better contrast
    justifyContent: "center",
    alignItems: "center",
    // Add subtle border
    borderWidth: 1,
    borderColor: "#333",
  },
  memberSince: {
    color: "#999",
    fontSize: 13, // Slightly larger for better readability
    marginTop: 4,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 14, // More rounded for modern look
    padding: 16, // More padding
    marginBottom: 16, // Increased spacing
    // Add subtle border for definition
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    marginRight: 8, // Increased spacing
  },
  statText: {
    color: "#fff",
    fontSize: 15, // Slightly larger
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 24, // Taller divider
    backgroundColor: "#333",
    marginHorizontal: 12, // More space around divider
  },
  discountBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f1f0f", // Darker green for better contrast
    paddingVertical: 12, // More padding
    paddingHorizontal: 20,
    borderRadius: 14, // More rounded
    borderWidth: 1.5, // Thicker border
    borderColor: "#22c55e60", // More visible border
  },
  discountIcon: {
    marginRight: 10, // Increased spacing
  },
  discountText: {
    color: "#22c55e",
    fontSize: 15, // Slightly larger
    fontWeight: "700", // Bolder
    letterSpacing: 0.3,
  },
});