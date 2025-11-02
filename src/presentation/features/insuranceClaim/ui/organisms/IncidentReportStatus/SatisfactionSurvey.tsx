import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FeedbackInput } from '../../molecules';
import { Button } from '../../../../../common/components/atoms/buttons/Button';

export interface SatisfactionSurveyProps {
    feedback: string;
    onFeedbackChange: (text: string) => void;
    onSubmit: () => void;
}

export const SatisfactionSurvey: React.FC<SatisfactionSurveyProps> = ({
    feedback,
    onFeedbackChange,
    onSubmit,
    }) => {
    return (
        <View style={styles.card}>
        <Text style={styles.cardTitle}>Satisfaction Survey</Text>
        <Text style={styles.surveyDescription}>
            Please rate your experience with our incident handling process
        </Text>
        <FeedbackInput
            value={feedback}
            onChangeText={onFeedbackChange}
            placeholder="Share your feedback (optional)"
        />
        <Button title="Submit Feedback" onPress={onSubmit} variant="primary" />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    surveyDescription: {
        fontSize: 13,
        color: '#9CA3AF',
        lineHeight: 18,
    },
});