import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  return (
    <View style={styles.profileHeader}>
      <View style={styles.profileInfo}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.profileDetails}>
          {/* Name Row with Membership Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.profileName} numberOfLines={1}>
              {name}
            </Text>
            <MembershipBadge tier={membershipTier} size="small" />
          </View>

          {/* Membership Discount Banner */}
          {discountPercentage > 0 && (
            <View style={styles.discountBanner}>
              <Text style={styles.discountText}>
                🎁 Giảm {discountPercentage}% mỗi lần đặt xe
              </Text>
            </View>
          )}

          <Text style={styles.profileMeta}>
            Thành viên kể từ: {memberSince}
          </Text>
          <Text style={styles.profileMeta}>
            {trips} Chuyến đi hoàn thành, đã đi được {distance}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Icon name="edit" />
      </TouchableOpacity>
      
      {documents.length === 0 && (
        <Badge type="error">Cần Xác Thực Tài Khoản</Badge>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    padding: 20,
    position: "relative",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    flexShrink: 1,
  },
  discountBanner: {
    backgroundColor: "#1a2e1a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 2,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#22c55e40",
  },
  discountText: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "600",
  },
  profileMeta: {
    color: "#999",
    fontSize: 13,
    marginTop: 2,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
});