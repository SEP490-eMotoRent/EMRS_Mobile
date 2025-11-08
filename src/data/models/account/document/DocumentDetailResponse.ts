import { UpdateRenterResponse } from "../renter/update/RenterAccountUpdateResponse";

export interface DocumentDetailResponse {
    id: string;
    documentType: string;
    documentNumber: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    verificationStatus: string;
    verifiedAt?: string;
    renterId: string;
    renter: UpdateRenterResponse;
    fileUrl: string[];
}