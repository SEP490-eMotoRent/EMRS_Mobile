export interface DocumentCreateRequest {
    documentNumber: string;
    issueDate?: string;             // ISO date string (YYYY-MM-DD)
    expiryDate?: string;            // ISO date string (YYYY-MM-DD)
    issuingAuthority?: string;
    verificationStatus: string;
    verifiedAt?: string;            // ISO date string
    frontDocumentFile: {
        uri: string;
        name: string;
        type: string;
    };
    backDocumentFile: {
        uri: string;
        name: string;
        type: string;
    };
}