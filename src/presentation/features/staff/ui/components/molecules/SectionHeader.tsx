import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../../../../common/theme/colors';

interface SectionHeaderProps {
  title: string;
  icon: keyof typeof AntDesign.glyphMap;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, style }) => {
  return (
    <View style={[styles.container, style]}>
      <AntDesign name={icon} size={20} color={colors.text.primary} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 8,
  },
});


