import React from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Icon } from '../../atoms/Icons/Icons';
import { Text } from '../../atoms/Text';

interface ImagePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (method: 'camera' | 'gallery') => void;
    title?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    visible,
    onClose,
    onSelect,
    title = 'Tải Lên Giấy Tờ',
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sheet}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Icon name="close" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                            {/* Description */}
                            <Text style={styles.description}>
                                Chọn phương thức để tải lên hình ảnh giấy tờ của bạn
                            </Text>

                            {/* Options */}
                            <View style={styles.optionsContainer}>
                                {/* Camera Option */}
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => onSelect('camera')}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.optionIconContainer}>
                                        <Icon name="camera" size={32} color="#B8A4FF" />
                                    </View>
                                    <View style={styles.optionContent}>
                                        <Text style={styles.optionTitle}>Chụp Ảnh</Text>
                                        <Text style={styles.optionDescription}>
                                            Mở camera để chụp giấy tờ
                                        </Text>
                                    </View>
                                    <Icon name="chevron" size={20} color="#666" />
                                </TouchableOpacity>

                                {/* Gallery Option */}
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => onSelect('gallery')}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.optionIconContainer}>
                                        <Icon name="image" size={32} color="#B8A4FF" />
                                    </View>
                                    <View style={styles.optionContent}>
                                        <Text style={styles.optionTitle}>Chọn Từ Thư Viện</Text>
                                        <Text style={styles.optionDescription}>
                                            Chọn ảnh có sẵn từ thiết bị
                                        </Text>
                                    </View>
                                    <Icon name="chevron" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Info Banner */}
                            <View style={styles.infoBanner}>
                                <Icon name="info" size={16} color="#3B82F6" />
                                <Text style={styles.infoText}>
                                    Đảm bảo ảnh rõ ràng, đầy đủ 4 góc và không bị mờ
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#000',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: '#2A2A2A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    description: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 24,
        lineHeight: 20,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 16,
        gap: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    optionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#B8A4FF20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionContent: {
        flex: 1,
        gap: 4,
    },
    optionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    optionDescription: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#3B82F620',
        padding: 12,
        borderRadius: 12,
        gap: 10,
        marginTop: 20,
    },
    infoText: {
        flex: 1,
        color: '#3B82F6',
        fontSize: 13,
        lineHeight: 18,
    },
});