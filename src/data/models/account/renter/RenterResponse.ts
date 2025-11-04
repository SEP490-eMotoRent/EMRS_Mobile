export interface AccountResponse {
    id: string;
    username: string;
    role: string;
    fullname: string;
}

export interface DocumentResponse {
    id: string;
    documentType: string;
    documentNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
    verificationStatus: string;
    verifiedAt: string;
    renterId: string;
    renter: null;
    images: Array<{           // ✅ CHANGED from fileUrl: string
        id: string;           // ✅ Media ID (GUID)
        fileUrl: string;      // ✅ Media URL
    }>;
}

export interface RenterResponse {
    id: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    avatarUrl: string | null;
    account: AccountResponse;
    documents: DocumentResponse[];
}