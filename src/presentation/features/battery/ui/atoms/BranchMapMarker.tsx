import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BranchMapMarkerProps {
  isSelected?: boolean;
}

/**
 * BranchMapMarker - Optimized marker with proper sizing
 * 
 * FIXES APPLIED (matching BranchMarker improvements):
 * 1. Bubble: 32×32 (compact, fits MapView limits)
 * 2. Icon: 12 (properly sized with padding)
 * 3. Padding: 3 (prevents icon from touching edges)
 * 4. Consistent styling across all devices
 */
export const BranchMapMarker: React.FC<BranchMapMarkerProps> = ({
  isSelected = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Main marker bubble */}
      <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
        <FontAwesome5
          name="charging-station"
          size={12}
          color={isSelected ? "#000" : "#fff"}
        />
      </View>

      {/* Pointer tail */}
      <View style={[styles.pointer, isSelected && styles.pointerSelected]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 36,
    height: 48,
  },
  bubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#b8a4ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  bubbleSelected: {
    backgroundColor: "#b8a4ff",
    borderColor: "#fff",
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  pointer: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#b8a4ff",
  },
  pointerSelected: {
    borderTopColor: "#fff",
  },
});