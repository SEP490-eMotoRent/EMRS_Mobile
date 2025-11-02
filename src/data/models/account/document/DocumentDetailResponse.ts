import { UpdateRenterResponse } from "../renter/update/RenterAccountUpdateResponse";

export interface DocumentDetailResponse {
    id: string;                     // Guid from C#
    documentType: string;
    documentNumber: string;
    issueDate?: string;             // ISO date string
    expiryDate?: string;            // ISO date string
    issuingAuthority?: string;
    verificationStatus: string;
    verifiedAt?: string;            // ISO date string
    renterId: string;               // Guid from C#
    renter: UpdateRenterResponse;         // Import from existing RenterResponse
    fileUrl: string[];              // List<string> from C#
}