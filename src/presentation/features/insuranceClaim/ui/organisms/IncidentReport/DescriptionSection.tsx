import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from '../../atoms';
import { VoiceNoteButton } from '../../molecules';

export interface DescriptionSectionProps {
    value: string;
    onChangeText: (text: string) => void;
    onVoiceNote?: () => void;
    error?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    value,
    onChangeText,
    onVoiceNote,
    error,
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
        {onVoiceNote && <VoiceNoteButton onPress={onVoiceNote} />}
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
});