export interface DocumentUpdateRequest {
    id: string;                     // Guid from C#
    documentNumber: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    verificationStatus: string;
    verifiedAt?: string;
    idFileFront: string;            // Guid - existing media ID
    frontDocumentFile?: {           // Optional - only if updating
        uri: string;
        name: string;
        type: string;
    };
    idFileBack: string;             // Guid - existing media ID
    backDocumentFile?: {            // Optional - only if updating
        uri: string;
        name: string;
        type: string;
    };
}