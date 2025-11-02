import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  View,
} from "react-native";
import { colors } from "../../../theme/colors";
import Icon from "react-native-vector-icons/Feather"; // Or your preferred icon lib

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: string; // ✅ New: Icon name (Feather / FontAwesome etc.)
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  icon,
}) => {
  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...(variant === "primary" && styles.primaryButton),
    ...(variant === "secondary" && styles.secondaryButton),
    ...(variant === "outline" && styles.outlineButton),
    ...(disabled && styles.disabledButton),
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...styles.text,
    ...(variant === "primary" && styles.primaryText),
    ...(variant === "secondary" && styles.secondaryText),
    ...(variant === "outline" && styles.outlineText),
    ...(disabled && styles.disabledText),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {icon && <Icon name={icon} size={20} style={styles.icon} />}
        <Text style={textStyleCombined}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    marginRight: 8,
    color: colors.button.text, // You can override via textStyle if needed
  },
  primaryButton: {
    backgroundColor: colors.button.background,
  },
  secondaryButton: {
    backgroundColor: colors.button.background,
    borderWidth: 1,
    borderColor: colors.button.border,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.button.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: colors.button.text,
  },
  secondaryText: {
    color: colors.button.text,
  },
  outlineText: {
    color: colors.button.text,
  },
  disabledText: {
    opacity: 0.5,
  },
});
