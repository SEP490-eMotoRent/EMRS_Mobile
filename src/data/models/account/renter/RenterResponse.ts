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
    images: Array<{
        id: string;
        fileUrl: string;
    }>;
}

export interface MembershipResponse {
    id: string;
    tierName: string;
    minBookings: number;
    discountPercentage: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface RenterResponse {
    id: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    avatar: AvatarMediaResponse | null;     // ← CHANGED: now object, not string
    account: AccountResponse;
    documents: DocumentResponse[];
    membership: MembershipResponse | null;
}

export interface AvatarMediaResponse {
    id: string;
    mediaType: string;
    fileUrl: string;
    docNo: string;
    entityType: string;
}