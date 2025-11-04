import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseVoiceRecordingResult {
    isRecording: boolean;
    recordingDuration: number;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<string | null>;
    cancelRecording: () => Promise<void>;
}

export const useVoiceRecording = (): UseVoiceRecordingResult => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const startRecording = async () => {
        try {
            // Request permission
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
                return;
            }

            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Start recording
            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setIsRecording(true);

            // Update duration every second
            newRecording.setOnRecordingStatusUpdate((status) => {
                if (status.isRecording) {
                    setRecordingDuration(Math.floor(status.durationMillis / 1000));
                }
            });

        } catch (err: any) {
            console.error('Failed to start recording:', err);
            Alert.alert('Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async (): Promise<string | null> => {
        if (!recording) return null;

        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            setRecordingDuration(0);

            return uri;
        } catch (err: any) {
            console.error('Failed to stop recording:', err);
            Alert.alert('Error', 'Failed to stop recording.');
            return null;
        }
    };

    const cancelRecording = async () => {
        if (!recording) return;

        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            setRecording(null);
            setRecordingDuration(0);
        } catch (err: any) {
            console.error('Failed to cancel recording:', err);
        }
    };

    return {
        isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    };
};