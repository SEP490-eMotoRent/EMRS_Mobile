import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface InfoItemProps {
  label: string;
  value: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    marginRight: 16,
  },
  value: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});


