export interface RenterResponse {
    id: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth?: string;
    avatarUrl: string;
    accountId: string;
    membershipId: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCodeExpiry?: string;
    createdAt: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    isDeleted: boolean;
    fullName?: string; // Added for convenience
}