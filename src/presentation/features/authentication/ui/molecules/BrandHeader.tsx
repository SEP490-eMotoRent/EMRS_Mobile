import React from "react";
import { View, StyleSheet } from "react-native";
import { BrandTitle } from "../atoms/BrandTitle";
import { BrandTagline } from "../atoms/BrandTagLine";

export const BrandHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <BrandTitle
        title="eMotoRent"
        accessibilityLabel="eMotoRent brand title"
      />
      <View style={styles.spacer} />
      <BrandTagline
        line1="Your Rental EBike."
        line2="Unlocked"
        accessibilityLabel="Your Rental EBike. Unlocked"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: "flex-start",
  },
  spacer: {
    height: 10,
  },
});
