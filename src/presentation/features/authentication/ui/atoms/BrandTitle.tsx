import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { colors } from "../../../../common/theme/colors";

interface BrandTitleProps {
  subtitle?: string;
  title?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const BrandTitle: React.FC<BrandTitleProps> = ({
  subtitle,
  style,
  textStyle,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <MaskedView
          maskElement={
            <Text style={[styles.appTitle, textStyle]}>
              <Text style={styles.brandEmoto}>eMoto</Text>
            </Text>
          }
        >
          <View style={styles.maskBackground}>
            <Text style={[styles.appTitle, styles.brandEmotoBase, textStyle]}>
              eMoto
            </Text>
          </View>
          <Animated.View
            style={[
              styles.gradientContainer,
              { transform: [{ translateX }] },
            ]}
          >
            <LinearGradient
              colors={["rgba(201, 182, 255, 0.3)", "#C9B6FF", "#E5DBFF", "#C9B6FF", "rgba(201, 182, 255, 0.3)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </Animated.View>
        </MaskedView>
        <Text style={[styles.appTitle, styles.brandRent, textStyle]}>Rent</Text>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 56,
    fontWeight: "bold",
  },
  brandEmoto: {
    color: "#C9B6FF",
  },
  brandEmotoBase: {
    color: "#C9B6FF",
  },
  brandRent: {
    color: colors.text.primary,
  },
  maskBackground: {
    backgroundColor: "transparent",
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 400,
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  subtitle: {
    fontSize: 24,
    color: colors.text.secondary,
    textAlign: "left",
  },
});