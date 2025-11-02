import { DocumentRepository } from "../../../repositories/account/DocumentRepository";

export class DeleteDocumentUseCase {
    constructor(private repository: DocumentRepository) {}

    async execute(documentId: string): Promise<string> {
        return await this.repository.deleteDocument(documentId);
    }
}