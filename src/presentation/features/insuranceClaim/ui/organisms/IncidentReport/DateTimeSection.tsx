import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateTimeInput } from '../../atoms';

export interface DateTimeSectionProps {
  date: string;
  time: string;
  onDatePress: () => void;
  onTimePress: () => void;
  dateError?: string;
  timeError?: string;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  time,
  onDatePress,
  onTimePress,
  dateError,
  timeError,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>Date & Time *</Text>
    <View style={styles.inputs}>
      <View style={styles.inputWrapper}>
        <DateTimeInput value={date} onPress={onDatePress} icon="📅" type="date" />
        {dateError && <Text style={styles.errorText}>{dateError}</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <DateTimeInput value={time} onPress={onTimePress} icon="🕐" type="time" />
        {timeError && <Text style={styles.errorText}>{timeError}</Text>}
      </View>
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
    inputWrapper: {
        gap: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#FF4444',
        marginTop: 4,
    },
});