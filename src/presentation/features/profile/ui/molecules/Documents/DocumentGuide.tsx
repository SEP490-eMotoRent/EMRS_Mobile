import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GuideOverlay } from '../../atoms/Documents/GuideOverlay';
import { Text } from '../../atoms/Text';
interface DocumentGuideProps {
    title: string;
    instruction: string;
}

export const DocumentGuide: React.FC<DocumentGuideProps> = ({ title, instruction }) => {
    return (
        <View style={styles.container}>
            <GuideOverlay />
            
            {/* Instructions at top */}
            <View style={styles.instructionsContainer}>
                <Text variant="title" style={styles.title}>{title}</Text>
                <Text style={styles.instruction}>{instruction}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    instructionsContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    instruction: {
        color: '#E5E5E5',
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 300,
    },
});