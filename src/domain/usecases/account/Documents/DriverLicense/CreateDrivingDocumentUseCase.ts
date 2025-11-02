import { DocumentCreateRequest } from "../../../../../data/models/account/document/DocumentCreateRequest";
import { DocumentDetailResponse } from "../../../../../data/models/account/document/DocumentDetailResponse";
import { DocumentRepository } from "../../../../repositories/account/DocumentRepository";

export class CreateDrivingDocumentUseCase {
    constructor(private repository: DocumentRepository) {}

    async execute(request: DocumentCreateRequest): Promise<DocumentDetailResponse> {
        return await this.repository.createDrivingDocument(request);
    }
}