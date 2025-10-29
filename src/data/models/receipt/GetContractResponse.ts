export interface GetContractResponse {
    id: string;
    contractNumber?: string;
    contractTerms?: string;
    otpCode?: string;
    expiresAt?: Date;
    contractStatus?: string;
    file?: string;
}