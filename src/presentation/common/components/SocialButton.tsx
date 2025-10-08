import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: any;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  onPress,
  icon,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.button.border,
    backgroundColor: colors.button.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    color: colors.button.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
