import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface BranchMapMarkerProps {
  isSelected?: boolean;
}

export const BranchMapMarker: React.FC<BranchMapMarkerProps> = ({
  isSelected = false,
}) => {
  return (
    <View style={styles.markerContainer}>
        <Image source={require("../../../../../../assets/images/charging.png")} style={styles.markerImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 32,
    height: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
});

