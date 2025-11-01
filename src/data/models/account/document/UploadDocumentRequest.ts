export interface UploadDocumentRequest {
    documentType: 'Citizen' | 'Driving'; // Note: API uses "Driving" not "License"
    documentNumber: string;
    issueDate: string; // ISO 8601 format: "2025-10-31T12:38:55.526Z"
    expiryDate: string; // ISO 8601 format
    issuingAuthority: string;
    verificationStatus: string;
    verifiedAt: string; // ISO 8601 format
    documentFile: {
        uri: string;
        name: string;
        type: string;
    };
}