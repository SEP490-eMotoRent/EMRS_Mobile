import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../../data/models/account/renter/RenterResponse';
import { useCreateDocument } from '../../../hooks/documents/useCreateDocument';
import { useDeleteDocument } from '../../../hooks/documents/useDeleteDocument';
import { useDocumentOCR } from '../../../hooks/documents/useDocumentOCR';
import { useUpdateDocument } from '../../../hooks/documents/useUpdateDocument';
import { useRenterProfile } from '../../../hooks/profile/useRenterProfile';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icons/Icons';
import { Text } from '../../atoms/Text';
import { DocumentSection } from '../../organisms/ProfileOrganism/DocumentSection';
import { DocumentDatePicker } from '../../molecules/Documents/DocumentDatePicker';

// Helper: Normalize URI to string
const normalizeUri = (uri: string | string[] | undefined): string | undefined => {
    if (!uri) return undefined;
    if (Array.isArray(uri)) {
        const firstItem = uri[0];
        return firstItem && typeof firstItem === 'string' ? firstItem : undefined;
    }
    return typeof uri === 'string' ? uri : undefined;
};

// Helper: Convert DD/MM/YYYY to YYYY-MM-DD
const convertDisplayToISO = (displayDate: string): string | undefined => {
    if (!displayDate || !displayDate.trim()) return undefined;
    if (!displayDate.includes('/')) return undefined;

    const parts = displayDate.split('/');
    if (parts.length !== 3) return undefined;

    const [day, month, year] = parts;
    if (!day || !month || !year) return undefined;

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Helper: Convert YYYY-MM-DD to DD/MM/YYYY
const convertISOToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    if (isoDate.includes('/')) return isoDate;
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

export const CitizenIDVerificationScreen = ({ navigation }: any) => {
    const { renterResponse, loading: fetchLoading, refresh } = useRenterProfile();
    const { createCitizen, loading: createDocLoading } = useCreateDocument();
    const { updateCitizen, loading: updateDocLoading } = useUpdateDocument();
    const { deleteDocument, loading: deleteLoading } = useDeleteDocument();
    const { processCitizenID, loading: ocrLoading } = useDocumentOCR();

    // Document state
    const [citizenDoc, setCitizenDoc] = useState<DocumentResponse | undefined>();

    // Document images state
    const [citizenFrontImage, setCitizenFrontImage] = useState<string | undefined>();
    const [citizenBackImage, setCitizenBackImage] = useState<string | undefined>();

    // Document form state
    const [citizenIdNumber, setCitizenIdNumber] = useState('');
    const [citizenIssueDate, setCitizenIssueDate] = useState('');
    const [citizenExpiryDate, setCitizenExpiryDate] = useState('');
    const [citizenAuthority, setCitizenAuthority] = useState('');

    // Auto-fill toggle
    const [citizenAutoFill, setCitizenAutoFill] = useState(true);

    // OCR processing state
    const [citizenOCRProcessing, setCitizenOCRProcessing] = useState(false);

    // Date picker state
    const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
    const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

    // Populate form when data is loaded
    useEffect(() => {
        if (renterResponse) {
            const citizenDocument = renterResponse.documents.find(
                (doc) => doc.documentType === 'Citizen'
            );

            setCitizenDoc(citizenDocument);

            if (citizenDocument) {
                setCitizenIdNumber(citizenDocument.documentNumber || '');
                if (citizenDocument.issueDate) {
                    setCitizenIssueDate(convertISOToDisplay(citizenDocument.issueDate));
                }
                if (citizenDocument.expiryDate) {
                    setCitizenExpiryDate(convertISOToDisplay(citizenDocument.expiryDate));
                }
                setCitizenAuthority(citizenDocument.issuingAuthority || '');
            }
        }
    }, [renterResponse]);

    // OCR Processing
    useEffect(() => {
        const processOCR = async () => {
            if (!citizenAutoFill || !citizenFrontImage || !citizenBackImage) return;
            if (citizenDoc) return;

            setCitizenOCRProcessing(true);

            try {
                const result = await processCitizenID(citizenFrontImage, citizenBackImage);

                if (result) {
                    if (result.documentNumber) setCitizenIdNumber(result.documentNumber);
                    if (result.issueDate) setCitizenIssueDate(result.issueDate);
                    if (result.expiryDate) setCitizenExpiryDate(result.expiryDate);
                    if (result.authority) setCitizenAuthority(result.authority);
                }
            } catch (error) {
                console.error('Citizen OCR error:', error);
            } finally {
                setCitizenOCRProcessing(false);
            }
        };

        processOCR();
    }, [citizenFrontImage, citizenBackImage, citizenAutoFill, citizenDoc]);

    const handleCitizenUpload = (method: 'camera' | 'gallery') => {
        if (method === 'camera') {
            navigation.navigate('DocumentCapture', {
                documentType: 'citizen',
                side: 'front',
                onPhotoTaken: (uri: string, side: 'front' | 'back') => {
                    console.log('📸 Citizen front captured:', uri);
                    setCitizenFrontImage(uri);

                    setTimeout(() => {
                        navigation.navigate('DocumentCapture', {
                            documentType: 'citizen',
                            side: 'back',
                            onPhotoTaken: (backUri: string, backSide: 'front' | 'back') => {
                                console.log('📸 Citizen back captured:', backUri);
                                setCitizenBackImage(backUri);
                            },
                        });
                    }, 100);
                },
            });
        } else {
            pickCitizenFromGallery();
        }
    };

    const pickCitizenFromGallery = async () => {
        try {
            const frontResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (frontResult.canceled) return;

            const frontUri = normalizeUri(frontResult.assets[0].uri);
            if (!frontUri) return;

            setCitizenFrontImage(frontUri);

            const backResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (backResult.canceled) return;

            const backUri = normalizeUri(backResult.assets[0].uri);
            if (backUri) {
                setCitizenBackImage(backUri);
            }
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
        }
    };

    const handleCitizenIssueDatePress = () => {
        setShowIssueDatePicker(true);
    };

    const handleCitizenExpiryDatePress = () => {
        setShowExpiryDatePicker(true);
    };

    const handleCitizenDocumentSubmit = async () => {
        try {
            if (!citizenIdNumber) {
                Alert.alert('Lỗi Xác Thực', 'Vui lòng nhập số CCCD');
                return;
            }

            if (!citizenDoc) {
                // CREATE new document
                if (!citizenFrontImage || !citizenBackImage) {
                    Alert.alert('Lỗi Xác Thực', 'Vui lòng tải lên cả ảnh mặt trước và mặt sau');
                    return;
                }

                const issueDate = convertDisplayToISO(citizenIssueDate);
                const expiryDate = convertDisplayToISO(citizenExpiryDate);

                const createRequest: any = {
                    documentNumber: citizenIdNumber,
                    verificationStatus: 'Pending',
                    frontDocumentFile: {
                        uri: citizenFrontImage,
                        name: 'citizen_front.jpg',
                        type: 'image/jpeg',
                    },
                    backDocumentFile: {
                        uri: citizenBackImage,
                        name: 'citizen_back.jpg',
                        type: 'image/jpeg',
                    },
                };

                if (issueDate) createRequest.issueDate = issueDate;
                if (expiryDate) createRequest.expiryDate = expiryDate;
                if (citizenAuthority && citizenAuthority.trim()) {
                    createRequest.issuingAuthority = citizenAuthority;
                }

                await createCitizen(createRequest);
                Alert.alert('Thành Công', 'Đã tải lên CCCD thành công!');
                await refresh();
            } else {
                // UPDATE existing document
                if (!citizenDoc.images || citizenDoc.images.length < 2) {
                    Alert.alert(
                        'Giấy Tờ Không Hợp Lệ',
                        'Giấy tờ hiện tại thiếu ảnh. Vui lòng tải lên cả ảnh mặt trước và mặt sau.'
                    );
                    return;
                }

                const updateRequest: any = {
                    id: citizenDoc.id,
                    documentNumber: citizenIdNumber,
                    issueDate: convertDisplayToISO(citizenIssueDate),
                    expiryDate: convertDisplayToISO(citizenExpiryDate),
                    issuingAuthority: citizenAuthority,
                    verificationStatus: citizenDoc.verificationStatus,
                    verifiedAt: citizenDoc.verifiedAt,
                    idFileFront: citizenDoc.images[0].id,
                    idFileBack: citizenDoc.images[1].id,
                };

                if (citizenFrontImage && !citizenFrontImage.startsWith('http')) {
                    updateRequest.frontDocumentFile = {
                        uri: citizenFrontImage,
                        name: 'citizen_front.jpg',
                        type: 'image/jpeg',
                    };
                }

                if (citizenBackImage && !citizenBackImage.startsWith('http')) {
                    updateRequest.backDocumentFile = {
                        uri: citizenBackImage,
                        name: 'citizen_back.jpg',
                        type: 'image/jpeg',
                    };
                }

                await updateCitizen(updateRequest);
                Alert.alert('Thành Công', 'Đã cập nhật CCCD thành công!');
                await refresh();
            }

            setCitizenFrontImage(undefined);
            setCitizenBackImage(undefined);
        } catch (error: any) {
            console.error('❌ Citizen document error:', error);
            Alert.alert('Lỗi', error.message || 'Không thể gửi CCCD');
        }
    };

    const handleDeleteCitizenDoc = async () => {
        if (!citizenDoc?.id) return;

        Alert.alert(
            'Xóa Giấy Tờ',
            'Bạn có chắc chắn muốn xóa CCCD này? Hành động này không thể hoàn tác.',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDocument(citizenDoc.id);
                            Alert.alert('Thành Công', 'Đã xóa CCCD thành công');

                            setCitizenDoc(undefined);
                            setCitizenIdNumber('');
                            setCitizenIssueDate('');
                            setCitizenExpiryDate('');
                            setCitizenAuthority('');
                            setCitizenFrontImage(undefined);
                            setCitizenBackImage(undefined);

                            await refresh();
                        } catch (error: any) {
                            Alert.alert('Lỗi', error.message || 'Không thể xóa giấy tờ');
                        }
                    },
                },
            ]
        );
    };

    if (fetchLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#B8A4FF" />
            </View>
        );
    }

    const isSaving = createDocLoading || updateDocLoading || deleteLoading;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Button onPress={() => navigation.goBack()} style={styles.backButton} variant="ghost">
                        <Icon name="back" size={24} />
                    </Button>
                    <Text variant="header">Căn Cước Công Dân</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Icon name="info" size={20} color="#B8A4FF" />
                        <Text style={styles.infoText}>
                            Vui lòng tải lên ảnh CCCD rõ ràng, đầy đủ cả mặt trước và mặt sau.
                        </Text>
                    </View>

                    {/* Document Section */}
                    <DocumentSection
                        title="Căn Cước Công Dân (CCCD)"
                        iconName="id"
                        documentNumber={citizenIdNumber}
                        onDocumentNumberChange={setCitizenIdNumber}
                        autoFill={citizenAutoFill}
                        onAutoFillChange={setCitizenAutoFill}
                        onUpload={handleCitizenUpload}
                        onUpdate={handleCitizenDocumentSubmit}
                        existingDocument={citizenDoc}
                        onViewDocument={(imageUrl) => {
                            // Image viewer handled by DocumentSection
                        }}
                        onDeleteDocument={citizenDoc ? handleDeleteCitizenDoc : undefined}
                        frontImage={citizenFrontImage}
                        backImage={citizenBackImage}
                        issueDate={citizenIssueDate}
                        expiryDate={citizenExpiryDate}
                        issuingAuthority={citizenAuthority}
                        onIssueDatePress={handleCitizenIssueDatePress}
                        onExpiryDatePress={handleCitizenExpiryDatePress}
                        onIssuingAuthorityChange={setCitizenAuthority}
                        ocrProcessing={citizenOCRProcessing}
                    />

                    <View style={styles.bottomPadding} />
                </ScrollView>

                {/* Fixed Bottom Action */}
                {isSaving && (
                    <View style={styles.savingOverlay}>
                        <ActivityIndicator size="large" color="#B8A4FF" />
                        <Text style={styles.savingText}>Đang xử lý...</Text>
                    </View>
                )}

                {/* Date Pickers */}
                <DocumentDatePicker
                    visible={showIssueDatePicker}
                    onClose={() => setShowIssueDatePicker(false)}
                    onConfirm={(date) => {
                        setCitizenIssueDate(date);
                        setShowIssueDatePicker(false);
                    }}
                    title="Chọn Ngày Phát Hành CCCD"
                    mode="issue"
                    initialDate={citizenIssueDate ? convertDisplayToISO(citizenIssueDate) : undefined}
                />

                <DocumentDatePicker
                    visible={showExpiryDatePicker}
                    onClose={() => setShowExpiryDatePicker(false)}
                    onConfirm={(date) => {
                        setCitizenExpiryDate(date);
                        setShowExpiryDatePicker(false);
                    }}
                    title="Chọn Ngày Hết Hạn CCCD"
                    mode="expiry"
                    initialDate={citizenExpiryDate ? convertDisplayToISO(citizenExpiryDate) : undefined}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    backButton: {
        padding: 8,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 24,
        gap: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    infoText: {
        flex: 1,
        color: '#9CA3AF',
        fontSize: 14,
        lineHeight: 20,
    },
    bottomPadding: {
        height: 40,
    },
    savingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        alignItems: 'center',
        gap: 12,
    },
    savingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});