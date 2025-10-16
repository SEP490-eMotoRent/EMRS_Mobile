import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface AppHeaderProps {
  title?: string;
  showMenu?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'eMotoRent', showMenu = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showMenu && (
        <TouchableOpacity style={styles.menuButton}>
          <AntDesign name="menu-fold" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  menuButton: {
    padding: 8,
  },
});


