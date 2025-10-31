import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from '../../atoms';
import { VoiceNoteButton } from '../../molecules';

export interface DescriptionSectionProps {
    value: string;
    onChangeText: (text: string) => void;
    onVoiceNote: () => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    value,
    onChangeText,
    onVoiceNote,
    }) => (
    <View style={styles.section}>
        <Text style={styles.title}>Description</Text>
        <TextInput
        multiline
        placeholder="Describe what happened in detail..."
        value={value}
        onChangeText={onChangeText}
        />
        <VoiceNoteButton onPress={onVoiceNote} />
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
});