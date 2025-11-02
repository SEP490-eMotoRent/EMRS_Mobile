import { ApiResponse } from "../../../../../core/network/APIResponse";
import { DocumentCreateRequest } from "../../../../models/account/document/DocumentCreateRequest";
import { DocumentDetailResponse } from "../../../../models/account/document/DocumentDetailResponse";
import { DocumentUpdateRequest } from "../../../../models/account/document/DocumentUpdateRequest";

export interface DocumentRemoteDataSource {
    createCitizenDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse>;
    createDrivingDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse>;
    updateCitizenDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse>;
    updateDrivingDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse>;
    deleteDocument(documentId: string): Promise<string>;
}