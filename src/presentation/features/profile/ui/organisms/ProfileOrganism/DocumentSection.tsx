import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icons/Icons';
import { Button } from '../../atoms/Button';
import { Switch } from 'react-native';
import { DocumentUploadPlaceholder } from '../../molecules/DocumentUploadPlaceholder';
import { TextInput } from '../../molecules/TextInput';
import { DateInput } from '../../molecules/DateInput';

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
    onViewDocument?: () => void;
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
    const hasDocument = !!existingDocument;
    const hasNewImages = !!(frontImage || backImage);
    
    const frontUrl = existingDocument?.images?.[0]?.fileUrl;
    const backUrl = existingDocument?.images?.[1]?.fileUrl;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Icon name={iconName} size={20} color="#FFD700" />
                    <Text variant="body" style={styles.title}>{title}</Text>
                    {hasDocument && existingDocument.verificationStatus && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="check" size={12} color="#10B981" />
                            <Text style={styles.verifiedText}>Đã duyệt</Text>
                        </View>
                    )}
                </View>
                <View style={styles.headerActions}>
                    <Button onPress={onUpdate} style={styles.updateButton} variant="ghost">
                        <Text style={styles.updateText}>Cập Nhập</Text>
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

            {/* ✅ OCR Processing Indicator */}
            {ocrProcessing && (
                <View style={styles.ocrProcessingBanner}>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={styles.ocrProcessingText}>
                        Đang trích xuất dữ liệu từ ảnh...
                    </Text>
                </View>
            )}

            <View style={hasDocument ? styles.disabledInput : undefined}>
                <TextInput
                    label={`${title === "Căn Cước Công Dân" ? "Citizen ID" : "License"} Number*`}
                    value={documentNumber}
                    onChangeText={onDocumentNumberChange}
                    placeholder="Enter number"
                    editable={!hasDocument}
                />
            </View>

            {/* Show editable fields for NEW documents, read-only for existing */}
            {hasDocument ? (
                <View style={styles.documentInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày Phát Hành:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(existingDocument.issueDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày Hết Hạn:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(existingDocument.expiryDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cơ Quan Cấp:</Text>
                        <Text style={styles.infoValue}>
                            {existingDocument.issuingAuthority}
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={styles.editableFields}>
                    {onIssueDatePress && (
                        <DateInput
                            label="Issue Date"
                            value={issueDate || ''}
                            onPress={onIssueDatePress}
                        />
                    )}
                    {onExpiryDatePress && (
                        <DateInput
                            label="Expiry Date"
                            value={expiryDate || ''}
                            onPress={onExpiryDatePress}
                        />
                    )}
                    {onIssuingAuthorityChange && (
                        <TextInput
                            label="Issuing Authority"
                            value={issuingAuthority || ''}
                            onChangeText={onIssuingAuthorityChange}
                            placeholder="Enter issuing authority"
                        />
                    )}
                </View>
            )}

            {additionalFields}

            <Text variant="label" style={styles.uploadLabel}>
                {hasDocument || hasNewImages 
                    ? 'Document Images' 
                    : `Upload ${title === "Căn Cước Công Dân" ? "ID" : "License"} Images`}
            </Text>

            {/* Show images: either new uploaded ones or existing ones */}
            {(hasDocument || hasNewImages) ? (
                <View style={styles.imagesContainer}>
                    {/* Front Image */}
                    <View style={styles.imageWrapper}>
                        <Text style={styles.imageLabel}>Mặt Trước</Text>
                        {(frontImage || frontUrl) ? (
                            <TouchableOpacity 
                                style={styles.documentImageContainer}
                                onPress={onViewDocument}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: frontImage || frontUrl }}
                                    style={styles.documentImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageOverlay}>
                                    <Icon name="document" size={20} color="#FFF" />
                                    <Text style={styles.overlayText}>Trước</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholderBox}>
                                <Icon name="image" size={32} color="#666" />
                                <Text style={styles.placeholderText}>Thiếu Ảnh Mặt Trước</Text>
                            </View>
                        )}
                    </View>

                    {/* Back Image */}
                    <View style={styles.imageWrapper}>
                        <Text style={styles.imageLabel}>Mặt Sau</Text>
                        {(backImage || backUrl) ? (
                            <TouchableOpacity 
                                style={styles.documentImageContainer}
                                onPress={onViewDocument}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: backImage || backUrl }}
                                    style={styles.documentImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageOverlay}>
                                    <Icon name="document" size={20} color="#FFF" />
                                    <Text style={styles.overlayText}>Sau</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholderBox}>
                                <Icon name="image" size={32} color="#666" />
                                <Text style={styles.placeholderText}>Thiếu Ảnh Mặt Sau</Text>
                            </View>
                        )}
                    </View>
                </View>
            ) : (
                <DocumentUploadPlaceholder onUpload={onUpload} />
            )}

            {/* Show status message if new images are uploaded */}
            {hasNewImages && !ocrProcessing && (
                <View style={styles.uploadedBadge}>
                    <Icon name="check" size={16} color="#10B981" />
                    <Text style={styles.uploadedText}>
                        {frontImage && backImage 
                            ? 'Cả 2 ảnh đã có. Nhấn "Cập Nhập" để lưu.'
                            : 'Vui lòng chụp cả mặt trước lẫn sau.'}
                    </Text>
                </View>
            )}

            <View style={styles.autoFillContainer}>
                <View style={styles.autoFillLeft}>
                    <Text>Tự động điền từ ảnh</Text>
                    {autoFill && (
                        <View style={styles.autoFillBadge}>
                            <Icon name="cross" size={12} color="#7C3AED" />
                            <Text style={styles.autoFillBadgeText}>AI</Text>
                        </View>
                    )}
                </View>
                <Switch 
                    value={autoFill} 
                    onValueChange={onAutoFillChange}
                    trackColor={{ false: '#767577', true: '#7C3AED80' }}
                    thumbColor={autoFill ? '#7C3AED' : '#f4f3f4'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
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
        fontWeight: '500',
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
        fontSize: 12,
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
        color: '#7C3AED',
        fontSize: 14,
    },
    deleteButton: {
        padding: 8,
    },
    ocrProcessingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED20',
        padding: 12,
        borderRadius: 8,
        gap: 12,
        marginBottom: 12,
    },
    ocrProcessingText: {
        flex: 1,
        color: '#7C3AED',
        fontSize: 13,
        fontWeight: '500',
    },
    documentInfo: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        gap: 6,
    },
    editableFields: {
        gap: 12,
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    uploadLabel: {
        marginTop: 8,
        marginBottom: 8,
    },
    imagesContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    imageWrapper: {
        flex: 1,
    },
    imageLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 6,
        fontWeight: '500',
    },
    documentImageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        height: 140,
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    overlayText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    },
    placeholderBox: {
        height: 140,
        borderRadius: 12,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    placeholderText: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    uploadedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B98120',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginTop: 12,
    },
    uploadedText: {
        flex: 1,
        color: '#10B981',
        fontSize: 13,
        fontWeight: '500',
    },
    autoFillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    autoFillLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    autoFillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED20',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 3,
    },
    autoFillBadgeText: {
        color: '#7C3AED',
        fontSize: 10,
        fontWeight: '700',
    },
    disabledInput: {
        opacity: 0.6,
        pointerEvents: 'none',
    },
});