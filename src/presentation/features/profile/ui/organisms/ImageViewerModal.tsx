import React from 'react';
import {
    Modal,
    StyleSheet,
    Image,
    TouchableOpacity,
    View,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { Icon } from '../atoms/Icons/Icons';

interface ImageViewerModalProps {
    visible: boolean;
    imageUrl: string;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
    visible,
    imageUrl,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Close button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="close" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});