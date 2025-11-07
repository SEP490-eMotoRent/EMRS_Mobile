import { useState } from 'react';
import { Alert } from 'react-native';
import { formatDisplayDate, recognizeCitizenIDBothSides, recognizeDriverLicenseBothSides } from '../../../../../core/network/fptAIService';

export interface OCRResult {
    documentNumber: string;
    issueDate: string;        // DD/MM/YYYY format for display
    expiryDate: string;       // DD/MM/YYYY format for display
    authority: string;
    // Additional fields
    name?: string;
    dob?: string;
    address?: string;
    licenseClass?: string;
}

export const useDocumentOCR = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Process Citizen ID images and extract data
     * REQUIRES both front and back images
     */
    const processCitizenID = async (
        frontImageUri: string,
        backImageUri: string
    ): Promise<OCRResult | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await recognizeCitizenIDBothSides(frontImageUri, backImageUri);

            // Convert ISO dates to display format (DD/MM/YYYY)
            const result: OCRResult = {
                documentNumber: data.id || '',
                issueDate: data.issueDate ? formatDisplayDate(data.issueDate) : '',
                expiryDate: data.expiryDate ? formatDisplayDate(data.expiryDate) : '',
                authority: data.authority || 'CỤC TRƯỞNG CỤC CẢNH SÁT ĐKQL CƯ TRÚ VÀ DLQG VỀ DÂN CƯ',
                name: data.name,
                dob: data.dob ? formatDisplayDate(data.dob) : '',
                address: data.address,
            };

            // Log what was extracted
            console.log('✅ Citizen ID OCR Success:', {
                documentNumber: result.documentNumber,
                issueDate: result.issueDate,
                expiryDate: result.expiryDate,
                authority: result.authority,
            });

            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to process Citizen ID';
            setError(errorMessage);
            
            console.error('❌ Citizen ID OCR Error:', errorMessage);
            
            Alert.alert(
                'OCR Error',
                `Could not extract data from ID card: ${errorMessage}. Please enter manually.`,
                [{ text: 'OK' }]
            );
            
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Process Driver's License images and extract data
     * REQUIRES both front and back images
     */
    const processDriverLicense = async (
        frontImageUri: string,
        backImageUri: string
    ): Promise<OCRResult | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await recognizeDriverLicenseBothSides(frontImageUri, backImageUri);

            // Convert ISO dates to display format (DD/MM/YYYY)
            const result: OCRResult = {
                documentNumber: data.id || '',
                issueDate: data.issueDate ? formatDisplayDate(data.issueDate) : '',
                expiryDate: data.expiryDate ? formatDisplayDate(data.expiryDate) : '',
                authority: data.authority || '',
                name: data.name,
                dob: data.dob ? formatDisplayDate(data.dob) : '',
                address: data.address,
                licenseClass: data.class || '',
            };

            // Log what was extracted
            console.log('✅ Driver License OCR Success:', {
                documentNumber: result.documentNumber,
                issueDate: result.issueDate,
                expiryDate: result.expiryDate,
                authority: result.authority,
                licenseClass: result.licenseClass,
            });

            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to process Driver License';
            setError(errorMessage);
            
            console.error('❌ Driver License OCR Error:', errorMessage);
            
            Alert.alert(
                'OCR Error',
                `Could not extract data from license: ${errorMessage}. Please enter manually.`,
                [{ text: 'OK' }]
            );
            
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        processCitizenID,
        processDriverLicense,
        loading,
        error,
    };
};