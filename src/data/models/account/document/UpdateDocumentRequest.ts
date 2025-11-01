export interface UpdateDocumentRequest {
    documentType: 'Citizen' | 'Driving';
    documentNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
    verificationStatus: string;
    verifiedAt: string;
    documentFile?: { // Optional for update
        uri: string;
        name: string;
        type: string;
    };
}