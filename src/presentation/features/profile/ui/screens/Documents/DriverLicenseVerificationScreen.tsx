import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { DocumentResponse } from '../../../../../../data/models/account/renter/RenterResponse';
import { useCreateDocument } from '../../../hooks/documents/useCreateDocument';
import { useDeleteDocument } from '../../../hooks/documents/useDeleteDocument';
import { useDocumentOCR } from '../../../hooks/documents/useDocumentOCR';
import { useUpdateDocument } from '../../../hooks/documents/useUpdateDocument';
import { useRenterProfile } from '../../../hooks/profile/useRenterProfile';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icons/Icons';
import { Text } from '../../atoms/Text';
import { DocumentDatePicker } from '../../molecules/Documents/DocumentDatePicker';
import { TextInput } from '../../molecules/TextInput';
import { DocumentSection } from '../../organisms/ProfileOrganism/DocumentSection';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export const DriverLicenseVerificationScreen = ({ navigation }: any) => {
    const { renterResponse, loading: fetchLoading, refresh } = useRenterProfile();
    const { createDriving, loading: createDocLoading } = useCreateDocument();
    const { updateDriving, loading: updateDocLoading } = useUpdateDocument();
    const { deleteDocument, loading: deleteLoading } = useDeleteDocument();
    const { processDriverLicense, loading: ocrLoading } = useDocumentOCR();

    // Document state
    const [licenseDoc, setLicenseDoc] = useState<DocumentResponse | undefined>();

    // Document images state
    const [licenseFrontImage, setLicenseFrontImage] = useState<string | undefined>();
    const [licenseBackImage, setLicenseBackImage] = useState<string | undefined>();

    // Document form state
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseClass, setLicenseClass] = useState('');
    const [licenseIssueDate, setLicenseIssueDate] = useState('');
    const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
    const [licenseAuthority, setLicenseAuthority] = useState('');

    // Auto-fill toggle
    const [licenseAutoFill, setLicenseAutoFill] = useState(true);

    // OCR processing state
    const [licenseOCRProcessing, setLicenseOCRProcessing] = useState(false);

    // Date picker state
    const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
    const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

    // Populate form when data is loaded
    useEffect(() => {
        if (renterResponse) {
            const licenseDocument = renterResponse.documents.find(
                (doc) =>
                    doc.documentType === 'Driving' ||
                    doc.documentType === 'License' ||
                    doc.documentType === 'DriverLicense'
            );

            setLicenseDoc(licenseDocument);

            if (licenseDocument) {
                setLicenseNumber(licenseDocument.documentNumber || '');
                if (licenseDocument.issueDate) {
                    setLicenseIssueDate(convertISOToDisplay(licenseDocument.issueDate));
                }
                if (licenseDocument.expiryDate) {
                    setLicenseExpiryDate(convertISOToDisplay(licenseDocument.expiryDate));
                }
                setLicenseAuthority(licenseDocument.issuingAuthority || '');
            }
        }
    }, [renterResponse]);

    // OCR Processing
    useEffect(() => {
        const processOCR = async () => {
            if (!licenseAutoFill || !licenseFrontImage || !licenseBackImage) return;
            if (licenseDoc) return;

            setLicenseOCRProcessing(true);

            try {
                const result = await processDriverLicense(licenseFrontImage, licenseBackImage);

                if (result) {
                    if (result.documentNumber) setLicenseNumber(result.documentNumber);
                    if (result.issueDate) setLicenseIssueDate(result.issueDate);
                    if (result.expiryDate) setLicenseExpiryDate(result.expiryDate);
                    if (result.authority) setLicenseAuthority(result.authority);
                    if (result.licenseClass) setLicenseClass(result.licenseClass);
                }
            } catch (error) {
                console.error('License OCR error:', error);
            } finally {
                setLicenseOCRProcessing(false);
            }
        };

        processOCR();
    }, [licenseFrontImage, licenseBackImage, licenseAutoFill, licenseDoc]);

    const handleLicenseUpload = (method: 'camera' | 'gallery') => {
        if (method === 'camera') {
            navigation.navigate('DocumentCapture', {
                documentType: 'license',
                side: 'front',
                onPhotoTaken: (uri: string, side: 'front' | 'back') => {
                    // console.log('📸 License front captured:', uri);
                    setLicenseFrontImage(uri);

                    setTimeout(() => {
                        navigation.navigate('DocumentCapture', {
                            documentType: 'license',
                            side: 'back',
                            onPhotoTaken: (backUri: string, backSide: 'front' | 'back') => {
                                // console.log('📸 License back captured:', backUri);
                                setLicenseBackImage(backUri);
                            },
                        });
                    }, 100);
                },
            });
        } else {
            pickLicenseFromGallery();
        }
    };

    const pickLicenseFromGallery = async () => {
        try {
            const frontResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (frontResult.canceled) return;

            const frontUri = normalizeUri(frontResult.assets[0].uri);
            if (!frontUri) return;

            setLicenseFrontImage(frontUri);

            const backResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (backResult.canceled) return;

            const backUri = normalizeUri(backResult.assets[0].uri);
            if (backUri) {
                setLicenseBackImage(backUri);
            }
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
        }
    };

    const handleLicenseIssueDatePress = () => {
        setShowIssueDatePicker(true);
    };

    const handleLicenseExpiryDatePress = () => {
        setShowExpiryDatePicker(true);
    };

    const handleLicenseDocumentSubmit = async () => {
        try {
            if (!licenseNumber) {
                Alert.alert('Lỗi Xác Thực', 'Vui lòng nhập số bằng lái');
                return;
            }

            if (!licenseDoc) {
                // CREATE new document
                if (!licenseFrontImage || !licenseBackImage) {
                    Alert.alert('Lỗi Xác Thực', 'Vui lòng tải lên cả ảnh mặt trước và mặt sau');
                    return;
                }

                await createDriving({
                    documentNumber: licenseNumber,
                    issueDate: convertDisplayToISO(licenseIssueDate),
                    expiryDate: convertDisplayToISO(licenseExpiryDate),
                    issuingAuthority: licenseAuthority,
                    verificationStatus: 'Pending',
                    frontDocumentFile: {
                        uri: licenseFrontImage,
                        name: 'license_front.jpg',
                        type: 'image/jpeg',
                    },
                    backDocumentFile: {
                        uri: licenseBackImage,
                        name: 'license_back.jpg',
                        type: 'image/jpeg',
                    },
                });

                Alert.alert('Thành Công', 'Đã tải lên bằng lái xe thành công!');
                await refresh();
            } else {
                // UPDATE existing document
                if (!licenseDoc.images || licenseDoc.images.length < 2) {
                    Alert.alert(
                        'Giấy Tờ Không Hợp Lệ',
                        'Giấy tờ hiện tại thiếu ảnh. Vui lòng tải lên cả ảnh mặt trước và mặt sau.'
                    );
                    return;
                }

                const updateRequest: any = {
                    id: licenseDoc.id,
                    documentNumber: licenseNumber,
                    issueDate: convertDisplayToISO(licenseIssueDate),
                    expiryDate: convertDisplayToISO(licenseExpiryDate),
                    issuingAuthority: licenseAuthority,
                    verificationStatus: licenseDoc.verificationStatus,
                    verifiedAt: licenseDoc.verifiedAt,
                    idFileFront: licenseDoc.images[0].id,
                    idFileBack: licenseDoc.images[1].id,
                };

                if (licenseFrontImage && !licenseFrontImage.startsWith('http')) {
                    updateRequest.frontDocumentFile = {
                        uri: licenseFrontImage,
                        name: 'license_front.jpg',
                        type: 'image/jpeg',
                    };
                }

                if (licenseBackImage && !licenseBackImage.startsWith('http')) {
                    updateRequest.backDocumentFile = {
                        uri: licenseBackImage,
                        name: 'license_back.jpg',
                        type: 'image/jpeg',
                    };
                }

                await updateDriving(updateRequest);
                Alert.alert('Thành Công', 'Đã cập nhật bằng lái xe thành công!');
                await refresh();
            }

            setLicenseFrontImage(undefined);
            setLicenseBackImage(undefined);
        } catch (error: any) {
            console.error('❌ License document error:', error);
            
            // Parse user-friendly error message
            let userMessage = 'Không thể xử lý bằng lái. Vui lòng thử lại sau.';
            
            const errorMsg = error.message?.toLowerCase() || '';
            
            if (errorMsg.includes('required') && errorMsg.includes('file')) {
                userMessage = 'Hiện tại không thể cập nhật giấy tờ.\n\n' +
                            'Backend yêu cầu tải lại ảnh. Tính năng này sẽ sớm được khắc phục.';
            } else if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
                userMessage = 'Mất kết nối mạng.\n\n' +
                            'Vui lòng kiểm tra Internet và thử lại.';
            } else if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
                userMessage = 'Thông tin chưa đầy đủ.\n\n' +
                            'Vui lòng kiểm tra và điền đầy đủ các trường bắt buộc.';
            } else if (errorMsg.includes('existed') || errorMsg.includes('duplicate')) {
                userMessage = 'Bằng lái này đã được đăng ký trong hệ thống.\n\n' +
                            'Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.';
            }
            
            Alert.alert('Không Thể Tải Lên', userMessage, [
                { text: 'Đóng', style: 'cancel' },
                { text: 'Thử Lại', onPress: () => handleLicenseDocumentSubmit() }
            ]);
        }
    };

    const handleDeleteLicenseDoc = async () => {
        if (!licenseDoc?.id) return;

        Alert.alert(
            'Xóa Giấy Tờ',
            'Bạn có chắc chắn muốn xóa bằng lái xe này? Hành động này không thể hoàn tác.',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDocument(licenseDoc.id);
                            Alert.alert('Thành Công', 'Đã xóa bằng lái xe thành công');

                            setLicenseDoc(undefined);
                            setLicenseNumber('');
                            setLicenseClass('');
                            setLicenseIssueDate('');
                            setLicenseExpiryDate('');
                            setLicenseAuthority('');
                            setLicenseFrontImage(undefined);
                            setLicenseBackImage(undefined);

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
                    <Text variant="header">Giấy Phép Lái Xe</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Icon name="info" size={20} color="#B8A4FF" />
                        <Text style={styles.infoText}>
                            Vui lòng tải lên ảnh bằng lái xe rõ ràng, đầy đủ cả mặt trước và mặt sau.
                        </Text>
                    </View>

                    {/* Document Section */}
                    <DocumentSection
                        title="Giấy Phép Lái Xe"
                        iconName="license"
                        documentNumber={licenseNumber}
                        onDocumentNumberChange={setLicenseNumber}
                        autoFill={licenseAutoFill}
                        onAutoFillChange={setLicenseAutoFill}
                        onUpload={handleLicenseUpload}
                        onUpdate={handleLicenseDocumentSubmit}
                        existingDocument={licenseDoc}
                        onViewDocument={(imageUrl) => {
                            // Image viewer handled by DocumentSection
                        }}
                        onDeleteDocument={licenseDoc ? handleDeleteLicenseDoc : undefined}
                        frontImage={licenseFrontImage}
                        backImage={licenseBackImage}
                        issueDate={licenseIssueDate}
                        expiryDate={licenseExpiryDate}
                        issuingAuthority={licenseAuthority}
                        onIssueDatePress={handleLicenseIssueDatePress}
                        onExpiryDatePress={handleLicenseExpiryDatePress}
                        onIssuingAuthorityChange={setLicenseAuthority}
                        ocrProcessing={licenseOCRProcessing}
                        additionalFields={
                            <>
                                <TextInput
                                    label="Hạng Bằng*"
                                    value={licenseClass}
                                    onChangeText={setLicenseClass}
                                    placeholder="Nhập hạng bằng (VD: B2, C)"
                                    editable={!licenseDoc}
                                />
                            </>
                        }
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
                        setLicenseIssueDate(date);
                        setShowIssueDatePicker(false);
                    }}
                    title="Chọn Ngày Phát Hành Bằng Lái"
                    mode="issue"
                    initialDate={licenseIssueDate ? convertDisplayToISO(licenseIssueDate) : undefined}
                />

                <DocumentDatePicker
                    visible={showExpiryDatePicker}
                    onClose={() => setShowExpiryDatePicker(false)}
                    onConfirm={(date) => {
                        setLicenseExpiryDate(date);
                        setShowExpiryDatePicker(false);
                    }}
                    title="Chọn Ngày Hết Hạn Bằng Lái"
                    mode="expiry"
                    initialDate={licenseExpiryDate ? convertDisplayToISO(licenseExpiryDate) : undefined}
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