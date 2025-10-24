// src/common/components/atoms/Button.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  // ✅ FIX: Flatten to proper ViewStyle object
  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...(variant === 'primary' && styles.primaryButton),
    ...(variant === 'secondary' && styles.secondaryButton),
    ...(variant === 'outline' && styles.outlineButton),
    ...(disabled && styles.disabledButton),
    ...style,
  };

  // ✅ FIX: Flatten to proper TextStyle object
  const textStyleCombined: TextStyle = {
    ...styles.text,
    ...(variant === 'primary' && styles.primaryText),
    ...(variant === 'secondary' && styles.secondaryText),
    ...(variant === 'outline' && styles.outlineText),
    ...(disabled && styles.disabledText),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: colors.button.background,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: colors.button.background,
    borderWidth: 1,
    borderColor: colors.button.border,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.button.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
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