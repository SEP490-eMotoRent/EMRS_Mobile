import { DocumentDetailResponse } from "../../../../../data/models/account/document/DocumentDetailResponse";
import { DocumentUpdateRequest } from "../../../../../data/models/account/document/DocumentUpdateRequest";
import { DocumentRepository } from "../../../../repositories/account/DocumentRepository";

export class UpdateCitizenDocumentUseCase {
    constructor(private repository: DocumentRepository) {}

    async execute(request: DocumentUpdateRequest): Promise<DocumentDetailResponse> {
        return await this.repository.updateCitizenDocument(request);
    }
}