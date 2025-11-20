import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../../common/theme/colors";
import { Branch } from "../../../../../domain/entities/operations/Branch";

interface NavigationViewProps {
  branch: Branch;
  distance: string;
  duration: string;
  onStop: () => void;
  onOverview: () => void;
}

export const NavigationView: React.FC<NavigationViewProps> = ({
  branch,
  distance,
  duration,
  onStop,
  onOverview,
}) => {
  // Calculate ETA
  const calculateETA = (duration: string): string => {
    const match = duration.match(/(\d+)/);
    if (!match) return "--:--";
    
    const minutes = parseInt(match[1]);
    const now = new Date();
    const eta = new Date(now.getTime() + minutes * 60000);
    
    return eta.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Top Bar - Only time info */}
      <View style={styles.topBar}>
        <View style={styles.routeInfo}>
          <Text style={styles.duration}>{duration}</Text>
          <Text style={styles.distance}>• {distance}</Text>
        </View>
        
        <View style={styles.eta}>
          <Text style={styles.etaTime}>{calculateETA(duration)}</Text>
        </View>
      </View>

      {/* Bottom Actions Only - Clean and minimal */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.stopButton} onPress={onStop}>
            <AntDesign name="close" size={22} color="#fff" />
            <Text style={styles.stopButtonText}>Dừng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.overviewButton} onPress={onOverview}>
            <AntDesign name="eye" size={20} color="#fff" />
            <Text style={styles.overviewButtonText}>Tổng quan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  duration: {
    fontSize: 28,
    fontWeight: "700",
    color: "#b8a4ff",
  },
  distance: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  eta: {
    alignItems: "flex-end",
  },
  etaTime: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  bottomActions: {
    flexDirection: "row",
    gap: 12,
  },
  stopButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  overviewButton: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  overviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});