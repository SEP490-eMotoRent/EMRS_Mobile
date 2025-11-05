import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { DocumentCameraView } from '../organisms/DocumentCameraView';

interface DocumentCaptureTemplateProps {
    documentType: 'front' | 'back';
    documentName: string;
    onCapture: (photoUri: string) => void;
    onClose: () => void;
}

export const DocumentCaptureTemplate: React.FC<DocumentCaptureTemplateProps> = ({
    documentType,
    documentName,
    onCapture,
    onClose,
}) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <DocumentCameraView
                documentType={documentType}
                documentName={documentName}
                onCapture={onCapture}
                onClose={onClose}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
});