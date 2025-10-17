import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../common/theme/colors";
import { BackButton } from "../../components/atoms/buttons/BackButton";

interface ScreenHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  submeta?: string;
  submetaStyle?: TextStyle;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showBell?: boolean;
  onBellPress?: () => void;
  badgeText?: string; // e.g., 'ST'
  onBack?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  containerStyle,
  titleStyle,
  subtitleStyle,
  submeta,
  submetaStyle,
  showSearch = false,
  onSearchPress,
  showBell = true,
  onBellPress,
  badgeText = "ST",
  onBack,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={onBack || (() => {})} />
      </View>

      <View style={styles.center}>
        {typeof title === "string" ? (
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        ) : (
          title
        )}
        {!!subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        )}
        {!!submeta && (
          <Text style={[styles.submeta, submetaStyle]}>{submeta}</Text>
        )}
      </View>

      <View style={styles.right}>
        {showSearch && (
          <TouchableOpacity style={styles.iconBtnSearch} onPress={onSearchPress}>
            <AntDesign name="search" size={18} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        {showBell && (
          <TouchableOpacity style={styles.iconBtn} onPress={onBellPress}>
            <AntDesign name="bell" size={18} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  backButtonContainer: {},
  center: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  submeta: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtnSearch: {
    padding: 8,
    marginRight: 2,
  },
  iconBtn: {
    padding: 8,
    marginRight: 6,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
});
