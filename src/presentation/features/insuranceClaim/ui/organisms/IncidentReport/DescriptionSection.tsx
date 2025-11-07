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
        <Text style={styles.title}>Mô tả sự cố *</Text>
        <TextInput
            multiline
            placeholder="Mô tả chi tiết sự cố... (tối thiểu 10 ký tự)"
            placeholderTextColor="#666"
            value={value}
            onChangeText={onChangeText}
            numberOfLines={6}
            textAlignVertical="top"
            style={styles.input}
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
                Nhấn lại để dừng ghi âm
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
    input: {
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#fff',
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#333',
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