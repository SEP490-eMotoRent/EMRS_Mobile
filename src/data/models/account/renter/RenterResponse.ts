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
    fileUrl: string;
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