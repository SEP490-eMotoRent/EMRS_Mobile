import { DocumentCreateRequest } from "../../../data/models/account/document/DocumentCreateRequest";
import { DocumentDetailResponse } from "../../../data/models/account/document/DocumentDetailResponse";
import { DocumentUpdateRequest } from "../../../data/models/account/document/DocumentUpdateRequest";


export interface DocumentRepository {
    createCitizenDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse>;
    createDrivingDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse>;
    updateCitizenDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse>;
    updateDrivingDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse>;
    deleteDocument(documentId: string): Promise<string>;
}