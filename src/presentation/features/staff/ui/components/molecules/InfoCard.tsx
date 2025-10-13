import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface InfoCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const InfoCard: React.FC<InfoCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
  },
});


