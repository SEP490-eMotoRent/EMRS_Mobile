import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { VoiceNoteButton } from '../../molecules';


export interface DescriptionSectionProps {
    value: string;
    onChangeText: (text: string) => void;
    onVoiceNote?: () => void;
    error?: string;
    isRecording?: boolean;
    recordingDuration?: number;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    value,
    onChangeText,
    onVoiceNote,
    error,
    isRecording = false,
    recordingDuration = 0,
}) => (
    <View style={styles.section}>
        <Text style={styles.title}>Description *</Text>
        <TextInput
            multiline
            placeholder="Describe what happened in detail... (minimum 10 characters)"
            value={value}
            onChangeText={onChangeText}
            numberOfLines={6}
            textAlignVertical="top"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        {onVoiceNote && (
            <VoiceNoteButton 
                onPress={onVoiceNote} 
                isRecording={isRecording}
                duration={recordingDuration}
            />
        )}
        {isRecording && (
            <Text style={styles.recordingHint}>
                Tap again to stop and transcribe
            </Text>
        )}
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
    errorText: {
        fontSize: 12,
        color: '#FF4444',
        marginTop: 8,
    },
    recordingHint: {
        fontSize: 12,
        color: '#7C3AED',
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});