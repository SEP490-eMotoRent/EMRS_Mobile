import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Switch, TouchableOpacity, View, Text as RNText, Alert } from 'react-native';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icons/Icons';
import { Text } from '../../atoms/Text';
import { DateInput } from '../../molecules/DateInput';
import { DocumentUploadPlaceholder } from '../../molecules/DocumentUploadPlaceholder';
import { TextInput } from '../../molecules/TextInput';
import { ImagePickerModal } from '../../molecules/Documents/ImagePickerModal';

interface DocumentData {
    id: string;
    documentNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
    verificationStatus: string;
    images: Array<{
        id: string;
        fileUrl: string;
    }>;
}

interface DocumentSectionProps {
    title: string;
    iconName: 'id' | 'license';
    documentNumber: string;
    onDocumentNumberChange: (text: string) => void;
    autoFill: boolean;
    onAutoFillChange: (value: boolean) => void;
    onUpload: (method: 'camera' | 'gallery') => void;
    onUpdate: () => void;
    additionalFields?: React.ReactNode;
    existingDocument?: DocumentData;
    onViewDocument?: (imageUrl: string) => void;
    onDeleteDocument?: () => void;
    frontImage?: string;
    backImage?: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    onIssueDatePress?: () => void;
    onExpiryDatePress?: () => void;
    onIssuingAuthorityChange?: (text: string) => void;
    ocrProcessing?: boolean;
}

export const DocumentSection: React.FC<DocumentSectionProps> = ({
    title,
    iconName,
    documentNumber,
    onDocumentNumberChange,
    autoFill,
    onAutoFillChange,
    onUpload,
    onUpdate,
    additionalFields,
    existingDocument,
    onViewDocument,
    onDeleteDocument,
    frontImage,
    backImage,
    issueDate,
    expiryDate,
    issuingAuthority,
    onIssueDatePress,
    onExpiryDatePress,
    onIssuingAuthorityChange,
    ocrProcessing = false,
}) => {
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [retakingSide, setRetakingSide] = useState<'front' | 'back' | null>(null);

    const hasDocument = !!existingDocument;
    const hasNewImages = !!(frontImage || backImage);
    const isEditing = hasDocument && hasNewImages;
    
    const frontUrl = existingDocument?.images?.[0]?.fileUrl;
    const backUrl = existingDocument?.images?.[1]?.fileUrl;

    // Determine label based on document type
    const numberLabel = title === "Căn Cước Công Dân (CCCD)" ? "Số CCCD*" : "Số Bằng Lái*";
    const uploadLabel = title === "Căn Cước Công Dân (CCCD)" ? "CCCD" : "Bằng Lái";

    // Format dates for display
    const displayIssueDate = hasDocument && existingDocument.issueDate
        ? new Date(existingDocument.issueDate).toLocaleDateString('vi-VN')
        : issueDate || '';
    
    const displayExpiryDate = hasDocument && existingDocument.expiryDate
        ? new Date(existingDocument.expiryDate).toLocaleDateString('vi-VN')
        : expiryDate || '';
    
    const displayAuthority = hasDocument 
        ? existingDocument.issuingAuthority 
        : issuingAuthority || '';

    const handleImagePickerSelect = (method: 'camera' | 'gallery') => {
        setShowImagePicker(false);
        if (retakingSide) {
            // If retaking specific side, just upload that side
            // This would require parent to handle individual side uploads
            onUpload(method);
            setRetakingSide(null);
        } else {
            onUpload(method);
        }
    };

    const handleRetakeImage = (side: 'front' | 'back') => {
        Alert.alert(
            'Chụp Lại Ảnh',
            `Bạn muốn chụp lại ảnh mặt ${side === 'front' ? 'trước' : 'sau'}?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Chụp Lại',
                    onPress: () => {
                        setRetakingSide(side);
                        setShowImagePicker(true);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Mode Indicator */}
            {isEditing && (
                <View style={styles.editModeBanner}>
                    <Icon name="edit" size={16} color="#F59E0B" />
                    <Text style={styles.editModeText}>Chế độ chỉnh sửa - Nhấn "Cập Nhật" để lưu thay đổi</Text>
                </View>
            )}

            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Icon name={iconName} size={20} color="#B8A4FF" />
                    <Text variant="body" style={styles.title}>{title}</Text>
                    {hasDocument && existingDocument.verificationStatus === 'Approved' && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="checkmark" size={12} color="#10B981" />
                            <Text style={styles.verifiedText}>Đã duyệt</Text>
                        </View>
                    )}
                </View>
                <View style={styles.headerActions}>
                    <Button 
                        onPress={onUpdate} 
                        style={styles.updateButton} 
                        variant="ghost"
                        disabled={!hasNewImages && !hasDocument}
                    >
                        <Text style={styles.updateText}>Cập Nhật</Text>
                    </Button>
                    {hasDocument && onDeleteDocument && (
                        <Button 
                            onPress={onDeleteDocument} 
                            style={styles.deleteButton} 
                            variant="ghost"
                        >
                            <Icon name="trash" size={16} color="#EF4444" />
                        </Button>
                    )}
                </View>
            </View>

            {/* OCR Processing Indicator */}
            {ocrProcessing && (
                <View style={styles.ocrProcessingBanner}>
                    <ActivityIndicator size="small" color="#B8A4FF" />
                    <Text style={styles.ocrProcessingText}>
                        AI đang trích xuất dữ liệu từ ảnh...
                    </Text>
                </View>
            )}

            {/* Document Number */}
            <View style={hasDocument ? styles.disabledField : undefined}>
                <TextInput
                    label={numberLabel}
                    value={documentNumber}
                    onChangeText={onDocumentNumberChange}
                    placeholder="Nhập số"
                    editable={!hasDocument}
                />
            </View>

            {/* Date & Authority Fields */}
            <View style={hasDocument ? styles.disabledField : styles.editableFields}>
                {onIssueDatePress && (
                    <DateInput
                        label="Ngày Phát Hành"
                        value={displayIssueDate}
                        onPress={hasDocument ? undefined : onIssueDatePress}
                        editable={!hasDocument}
                    />
                )}
                {onExpiryDatePress && (
                    <DateInput
                        label="Ngày Hết Hạn"
                        value={displayExpiryDate}
                        onPress={hasDocument ? undefined : onExpiryDatePress}
                        editable={!hasDocument}
                    />
                )}
                {onIssuingAuthorityChange && (
                    <TextInput
                        label="Cơ Quan Cấp"
                        value={displayAuthority}
                        onChangeText={onIssuingAuthorityChange}
                        placeholder="Nhập cơ quan cấp"
                        editable={!hasDocument}
                    />
                )}
            </View>

            {additionalFields}

            {/* Images Section */}
            <Text variant="label" style={styles.uploadLabel}>
                {hasDocument || hasNewImages 
                    ? 'Hình Ảnh Giấy Tờ' 
                    : `Tải Lên Ảnh ${uploadLabel}`}
            </Text>

            {(hasDocument || hasNewImages) ? (
                <View style={styles.imagesContainer}>
                    {/* Front Image */}
                    <View style={styles.imageWrapper}>
                        <View style={styles.imageLabelRow}>
                            <RNText style={styles.imageLabel}>Mặt Trước</RNText>
                            {(frontImage || frontUrl) && (
                                <TouchableOpacity 
                                    onPress={() => handleRetakeImage('front')}
                                    style={styles.retakeButton}
                                >
                                    <Icon name="camera" size={14} color="#B8A4FF" />
                                    <RNText style={styles.retakeText}>Chụp lại</RNText>
                                </TouchableOpacity>
                            )}
                        </View>
                        {(frontImage || frontUrl) ? (
                            <TouchableOpacity 
                                style={styles.documentImageContainer}
                                onPress={() => onViewDocument?.(frontImage || frontUrl || '')}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: frontImage || frontUrl }}
                                    style={styles.documentImage}
                                    resizeMode="cover"
                                />
                                {frontImage && !frontImage.startsWith('http') && (
                                    <View style={styles.newImageBadge}>
                                        <Icon name="check" size={12} color="#10B981" />
                                        <RNText style={styles.newImageText}>Mới</RNText>
                                    </View>
                                )}
                                <View style={styles.imageOverlay}>
                                    <Icon name="document" size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholderBox}>
                                <Icon name="image" size={32} color="#666" />
                                <RNText style={styles.placeholderText}>Thiếu Ảnh</RNText>
                            </View>
                        )}
                    </View>

                    {/* Back Image */}
                    <View style={styles.imageWrapper}>
                        <View style={styles.imageLabelRow}>
                            <RNText style={styles.imageLabel}>Mặt Sau</RNText>
                            {(backImage || backUrl) && (
                                <TouchableOpacity 
                                    onPress={() => handleRetakeImage('back')}
                                    style={styles.retakeButton}
                                >
                                    <Icon name="camera" size={14} color="#B8A4FF" />
                                    <RNText style={styles.retakeText}>Chụp lại</RNText>
                                </TouchableOpacity>
                            )}
                        </View>
                        {(backImage || backUrl) ? (
                            <TouchableOpacity 
                                style={styles.documentImageContainer}
                                onPress={() => onViewDocument?.(backImage || backUrl || '')}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: backImage || backUrl }}
                                    style={styles.documentImage}
                                    resizeMode="cover"
                                />
                                {backImage && !backImage.startsWith('http') && (
                                    <View style={styles.newImageBadge}>
                                        <Icon name="check" size={12} color="#10B981" />
                                        <RNText style={styles.newImageText}>Mới</RNText>
                                    </View>
                                )}
                                <View style={styles.imageOverlay}>
                                    <Icon name="document" size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholderBox}>
                                <Icon name="image" size={32} color="#666" />
                                <RNText style={styles.placeholderText}>Thiếu Ảnh</RNText>
                            </View>
                        )}
                    </View>
                </View>
            ) : (
                <DocumentUploadPlaceholder onUpload={() => setShowImagePicker(true)} />
            )}

            {/* Status Messages */}
            {hasNewImages && !ocrProcessing && (
                <View style={styles.uploadedBadge}>
                    <Icon name="info" size={16} color="#3B82F6" />
                    <Text style={styles.uploadedText}>
                        {frontImage && backImage 
                            ? 'Cả 2 ảnh đã có. Nhấn "Cập Nhật" để lưu thay đổi.'
                            : 'Vui lòng chụp cả mặt trước lẫn sau.'}
                    </Text>
                </View>
            )}

            {/* Auto-fill Toggle */}
            {!hasDocument && (
                <View style={styles.autoFillContainer}>
                    <View style={styles.autoFillLeft}>
                        <Icon name="info" size={16} color="#B8A4FF" />
                        <Text style={styles.autoFillLabel}>Tự động điền bằng AI</Text>
                        {autoFill && (
                            <View style={styles.autoFillBadge}>
                                <Icon name="checkmark" size={10} color="#B8A4FF" />
                                <Text style={styles.autoFillBadgeText}>BẬT</Text>
                            </View>
                        )}
                    </View>
                    <Switch 
                        value={autoFill} 
                        onValueChange={onAutoFillChange}
                        trackColor={{ false: '#374151', true: '#B8A4FF50' }}
                        thumbColor={autoFill ? '#B8A4FF' : '#9CA3AF'}
                    />
                </View>
            )}

            {/* Image Picker Modal */}
            <ImagePickerModal
                visible={showImagePicker}
                onClose={() => {
                    setShowImagePicker(false);
                    setRetakingSide(null);
                }}
                onSelect={handleImagePickerSelect}
                title={retakingSide ? `Chụp Lại Mặt ${retakingSide === 'front' ? 'Trước' : 'Sau'}` : 'Tải Lên Giấy Tờ'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    editModeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B20',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#F59E0B',
    },
    editModeText: {
        flex: 1,
        color: '#F59E0B',
        fontSize: 13,
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B98120',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    verifiedText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    updateButton: {
        padding: 0,
    },
    updateText: {
        color: '#B8A4FF',
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        padding: 8,
    },
    ocrProcessingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B8A4FF20',
        padding: 12,
        borderRadius: 8,
        gap: 12,
        marginBottom: 12,
    },
    ocrProcessingText: {
        flex: 1,
        color: '#B8A4FF',
        fontSize: 13,
        fontWeight: '500',
    },
    editableFields: {
        gap: 0,
    },
    disabledField: {
        opacity: 0.7,
        pointerEvents: 'none',
    },
    uploadLabel: {
        marginTop: 16,
        marginBottom: 12,
        fontWeight: '600',
    },
    imagesContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    imageWrapper: {
        flex: 1,
    },
    imageLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#B8A4FF20',
    },
    retakeText: {
        color: '#B8A4FF',
        fontSize: 11,
        fontWeight: '600',
    },
    documentImageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#111',
        height: 160,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    newImageBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    newImageText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderBox: {
        height: 160,
        borderRadius: 12,
        backgroundColor: '#111',
        borderWidth: 2,
        borderColor: '#2A2A2A',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    placeholderText: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
    },
    uploadedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F620',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginTop: 12,
    },
    uploadedText: {
        flex: 1,
        color: '#3B82F6',
        fontSize: 13,
        fontWeight: '500',
    },
    autoFillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        padding: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    autoFillLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    autoFillLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    autoFillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B8A4FF30',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 3,
    },
    autoFillBadgeText: {
        color: '#B8A4FF',
        fontSize: 10,
        fontWeight: '700',
    },
});