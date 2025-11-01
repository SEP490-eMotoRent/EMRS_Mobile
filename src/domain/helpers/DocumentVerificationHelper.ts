import { DocumentResponse } from "../../data/models/account/renter/RenterResponse";

export type VerificationStatus = 'verified' | 'valid' | 'needed' | 'expired';

export interface VerificationInfo {
    label: string;
    status: VerificationStatus;
    validUntil?: string;
}

export class DocumentVerificationHelper {
    /**
     * Get verification status for ID/Citizen document
     */
    static getIdVerification(documents: DocumentResponse[]): VerificationInfo {
        const citizenDoc = documents.find(doc => doc.documentType === 'Citizen');
        
        if (!citizenDoc) {
        return {
            label: 'ID verification',
            status: 'needed'
        };
        }

        const expiryDate = new Date(citizenDoc.expiryDate);
        const now = new Date();

        if (expiryDate < now) {
        return {
            label: 'ID verification',
            status: 'expired'
        };
        }

        return {
        label: 'ID verification',
        status: 'verified',
        validUntil: expiryDate.getFullYear().toString()
        };
    }

    /**
     * Get verification status for Driver's License
     */
    static getDriverLicenseVerification(documents: DocumentResponse[]): VerificationInfo {
        const licenseDoc = documents.find(doc => 
        doc.documentType === 'DriverLicense' || doc.documentType === 'License'
        );
        
        if (!licenseDoc) {
        return {
            label: "Driver's license",
            status: 'needed'
        };
        }

        const expiryDate = new Date(licenseDoc.expiryDate);
        const now = new Date();

        if (expiryDate < now) {
        return {
            label: "Driver's license",
            status: 'expired'
        };
        }

        return {
        label: "Driver's license",
        status: 'valid',
        validUntil: expiryDate.getFullYear().toString()
        };
    }

    /**
     * Get phone verification status
     */
    static getPhoneVerification(phone: string): VerificationInfo {
        // Assuming phone is verified if it exists and is not empty
        const isVerified = phone && phone.trim().length > 0;
        
        return {
        label: 'Phone Number',
        status: isVerified ? 'verified' : 'needed'
        };
    }

    /**
     * Get all verifications for a renter
     */
    static getAllVerifications(
        documents: DocumentResponse[], 
        phone: string
    ): VerificationInfo[] {
        return [
        this.getIdVerification(documents),
        this.getDriverLicenseVerification(documents),
        this.getPhoneVerification(phone)
        ];
    }

    /**
     * Check if renter has completed all required verifications
     */
    static isFullyVerified(documents: DocumentResponse[], phone: string): boolean {
        const verifications = this.getAllVerifications(documents, phone);
        return verifications.every(v => 
        v.status === 'verified' || v.status === 'valid'
        );
    }
}