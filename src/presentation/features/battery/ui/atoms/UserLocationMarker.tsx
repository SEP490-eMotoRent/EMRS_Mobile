import React from "react";
import { View, StyleSheet } from "react-native";

export const UserLocationMarker: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Smaller static outer circle */}
      <View style={styles.staticCircle} />
      
      {/* Bigger main blue dot */}
      <View style={styles.mainDot}>
        <View style={styles.innerDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,          // Reduced from 50
    height: 40,         // Reduced from 50
    alignItems: "center",
    justifyContent: "center",
  },
  staticCircle: {
    position: "absolute",
    width: 24,          // Reduced from 32
    height: 24,         // Reduced from 32
    borderRadius: 12,   // Half of 24
    backgroundColor: "rgba(74, 144, 226, 0.25)",
  },
  mainDot: {
    width: 22,          // Increased from 18
    height: 22,         // Increased from 18
    borderRadius: 11,   // Half of 22
    backgroundColor: "#4A90E2",
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  innerDot: {
    width: 7,           // Slightly increased from 6
    height: 7,          // Slightly increased from 6
    borderRadius: 3.5,  // Half of 7
    backgroundColor: "#fff",
  },
});