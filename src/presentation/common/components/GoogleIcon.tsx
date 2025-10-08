import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export const GoogleIcon: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.g}>G</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  g: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
