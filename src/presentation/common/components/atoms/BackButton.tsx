import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

interface BackButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, label = 'Back' }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.backIconCircle}>
        <AntDesign name="left" size={16} color="#000" />
      </View>
      <Text style={styles.backButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.button.border,
    backgroundColor: colors.button.background,
    marginBottom: 20,
  },
  backIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});


