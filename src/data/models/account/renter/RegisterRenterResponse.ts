export interface RegisterRenterResponse {
    id: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth?: string;
    avatarUrl: string;
    accountId: string;
    membershipId: string;
    verificationCodeExpiry?: string;
}