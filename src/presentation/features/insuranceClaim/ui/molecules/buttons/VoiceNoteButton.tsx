import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface VoiceNoteButtonProps {
    onPress: () => void;
    isRecording?: boolean;
}

export const VoiceNoteButton: React.FC<VoiceNoteButtonProps> = ({ onPress, isRecording }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.icon}>🎤</Text>
        <Text style={styles.text}>{isRecording ? 'Recording...' : 'Voice Note'}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    icon: {
        fontSize: 18,
    },
    text: {
        fontSize: 14,
        color: '#fff',
    },
});