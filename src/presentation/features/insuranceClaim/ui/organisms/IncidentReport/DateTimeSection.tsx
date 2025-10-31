import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateTimeInput } from '../../atoms';

export interface DateTimeSectionProps {
  date: string;
  time: string;
  onDatePress: () => void;
  onTimePress: () => void;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  time,
  onDatePress,
  onTimePress,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>Date & Time</Text>
    <View style={styles.inputs}>
      <DateTimeInput value={date} onPress={onDatePress} icon="📅" type="date" />
      <DateTimeInput value={time} onPress={onTimePress} icon="🕐" type="time" />
    </View>
  </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    inputs: {
        gap: 12,
    },
});