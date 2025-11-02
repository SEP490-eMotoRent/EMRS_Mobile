import { DocumentRepository } from "../../../domain/repositories/account/DocumentRepository";
import { DocumentRemoteDataSource } from "../../datasources/interfaces/remote/account/DocumentRemoteDataSource";
import { DocumentCreateRequest } from "../../models/account/document/DocumentCreateRequest";
import { DocumentDetailResponse } from "../../models/account/document/DocumentDetailResponse";
import { DocumentUpdateRequest } from "../../models/account/document/DocumentUpdateRequest";


export class DocumentRepositoryImpl implements DocumentRepository {
    constructor(
        private remote: DocumentRemoteDataSource
    ) {}

    async createCitizenDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse> {
        try {
            return await this.remote.createCitizenDocument(request);
        } catch (error) {
            throw error;
        }
    }

    async createDrivingDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse> {
        try {
            return await this.remote.createDrivingDocument(request);
        } catch (error) {
            throw error;
        }
    }

    async updateCitizenDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse> {
        try {
            return await this.remote.updateCitizenDocument(request);
        } catch (error) {
            throw error;
        }
    }

    async updateDrivingDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse> {
        try {
            return await this.remote.updateDrivingDocument(request);
        } catch (error) {
            throw error;
        }
    }

    async deleteDocument(documentId: string): Promise<string> {
        try {
            return await this.remote.deleteDocument(documentId);
        } catch (error) {
            throw error;
        }
    }
}