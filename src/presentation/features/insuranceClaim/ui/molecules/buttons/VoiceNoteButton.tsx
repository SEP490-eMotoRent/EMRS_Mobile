import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

interface VoiceNoteButtonProps {
    onPress: () => void;
    isRecording?: boolean;
    duration?: number;
}

export const VoiceNoteButton: React.FC<VoiceNoteButtonProps> = ({ 
    onPress, 
    isRecording = false,
    duration = 0 
}) => {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <TouchableOpacity 
            style={[styles.button, isRecording && styles.buttonRecording]} 
            onPress={onPress}
        >
            <View style={styles.content}>
                <Text style={styles.icon}>{isRecording ? '⏹️' : '🎤'}</Text>
                <Text style={styles.text}>
                    {isRecording ? `Recording... ${formatDuration(duration)}` : 'Voice Note'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    buttonRecording: {
        backgroundColor: '#7C3AED',
        borderColor: '#7C3AED',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 18,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});