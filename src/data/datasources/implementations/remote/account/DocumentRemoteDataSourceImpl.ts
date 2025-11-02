import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { AppLogger } from "../../../../../core/utils/Logger";
import { ServerException } from "../../../../../core/errors/ServerException";
import { DocumentCreateRequest } from "../../../../models/account/document/DocumentCreateRequest";
import { DocumentDetailResponse } from "../../../../models/account/document/DocumentDetailResponse";
import { DocumentUpdateRequest } from "../../../../models/account/document/DocumentUpdateRequest";
import { DocumentRemoteDataSource } from "../../../interfaces/remote/account/DocumentRemoteDataSource";


export class DocumentRemoteDataSourceImpl implements DocumentRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly logger = AppLogger.getInstance();

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
    }

    async createCitizenDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse> {
        try {
            this.logger.info('Creating citizen document...');

            const formData = new FormData();
            
            // Add all fields
            formData.append('DocumentNumber', request.documentNumber);
            if (request.issueDate) formData.append('IssueDate', request.issueDate);
            if (request.expiryDate) formData.append('ExpiryDate', request.expiryDate);
            if (request.issuingAuthority) formData.append('IssuingAuthority', request.issuingAuthority);
            formData.append('VerificationStatus', request.verificationStatus);
            if (request.verifiedAt) formData.append('VerifiedAt', request.verifiedAt);

            // Add files
            formData.append('FrontDocumentFile', {
                uri: request.frontDocumentFile.uri,
                name: request.frontDocumentFile.name,
                type: request.frontDocumentFile.type,
            } as any);

            formData.append('BackDocumentFile', {
                uri: request.backDocumentFile.uri,
                name: request.backDocumentFile.name,
                type: request.backDocumentFile.type,
            } as any);

            const response = await this.apiClient.post<ApiResponse<DocumentDetailResponse>>(
                ApiEndpoints.document.createCitizen,
                formData
            );

            this.logger.info('Citizen document created successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to create citizen document: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to create citizen document',
                error.response?.status || 500
            );
        }
    }

    async createDrivingDocument(request: DocumentCreateRequest): Promise<DocumentDetailResponse> {
        try {
            this.logger.info('Creating driving document...');

            const formData = new FormData();
            
            formData.append('DocumentNumber', request.documentNumber);
            if (request.issueDate) formData.append('IssueDate', request.issueDate);
            if (request.expiryDate) formData.append('ExpiryDate', request.expiryDate);
            if (request.issuingAuthority) formData.append('IssuingAuthority', request.issuingAuthority);
            formData.append('VerificationStatus', request.verificationStatus);
            if (request.verifiedAt) formData.append('VerifiedAt', request.verifiedAt);

            formData.append('FrontDocumentFile', {
                uri: request.frontDocumentFile.uri,
                name: request.frontDocumentFile.name,
                type: request.frontDocumentFile.type,
            } as any);

            formData.append('BackDocumentFile', {
                uri: request.backDocumentFile.uri,
                name: request.backDocumentFile.name,
                type: request.backDocumentFile.type,
            } as any);

            const response = await this.apiClient.post<ApiResponse<DocumentDetailResponse>>(
                ApiEndpoints.document.createDriving,
                formData
            );

            this.logger.info('Driving document created successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to create driving document: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to create driving document',
                error.response?.status || 500
            );
        }
    }

    async updateCitizenDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse> {
        try {
            this.logger.info(`Updating citizen document: ${request.id}`);

            const formData = new FormData();
            
            formData.append('Id', request.id);
            formData.append('DocumentNumber', request.documentNumber);
            if (request.issueDate) formData.append('IssueDate', request.issueDate);
            if (request.expiryDate) formData.append('ExpiryDate', request.expiryDate);
            if (request.issuingAuthority) formData.append('IssuingAuthority', request.issuingAuthority);
            formData.append('VerificationStatus', request.verificationStatus);
            if (request.verifiedAt) formData.append('VerifiedAt', request.verifiedAt);
            
            formData.append('IdFileFront', request.idFileFront);
            formData.append('IdFileBack', request.idFileBack);

            // Only add files if they're being updated
            if (request.frontDocumentFile) {
                formData.append('FrontDocumentFile', {
                    uri: request.frontDocumentFile.uri,
                    name: request.frontDocumentFile.name,
                    type: request.frontDocumentFile.type,
                } as any);
            }

            if (request.backDocumentFile) {
                formData.append('BackDocumentFile', {
                    uri: request.backDocumentFile.uri,
                    name: request.backDocumentFile.name,
                    type: request.backDocumentFile.type,
                } as any);
            }

            const response = await this.apiClient.put<ApiResponse<DocumentDetailResponse>>(
                ApiEndpoints.document.updateCitizen,
                formData
            );

            this.logger.info('Citizen document updated successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to update citizen document: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to update citizen document',
                error.response?.status || 500
            );
        }
    }

    async updateDrivingDocument(request: DocumentUpdateRequest): Promise<DocumentDetailResponse> {
        try {
            this.logger.info(`Updating driving document: ${request.id}`);

            const formData = new FormData();
            
            formData.append('Id', request.id);
            formData.append('DocumentNumber', request.documentNumber);
            if (request.issueDate) formData.append('IssueDate', request.issueDate);
            if (request.expiryDate) formData.append('ExpiryDate', request.expiryDate);
            if (request.issuingAuthority) formData.append('IssuingAuthority', request.issuingAuthority);
            formData.append('VerificationStatus', request.verificationStatus);
            if (request.verifiedAt) formData.append('VerifiedAt', request.verifiedAt);
            
            formData.append('IdFileFront', request.idFileFront);
            formData.append('IdFileBack', request.idFileBack);

            if (request.frontDocumentFile) {
                formData.append('FrontDocumentFile', {
                    uri: request.frontDocumentFile.uri,
                    name: request.frontDocumentFile.name,
                    type: request.frontDocumentFile.type,
                } as any);
            }

            if (request.backDocumentFile) {
                formData.append('BackDocumentFile', {
                    uri: request.backDocumentFile.uri,
                    name: request.backDocumentFile.name,
                    type: request.backDocumentFile.type,
                } as any);
            }

            const response = await this.apiClient.put<ApiResponse<DocumentDetailResponse>>(
                ApiEndpoints.document.updateDriving,
                formData
            );

            this.logger.info('Driving document updated successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to update driving document: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to update driving document',
                error.response?.status || 500
            );
        }
    }

    async deleteDocument(documentId: string): Promise<string> {
        try {
            this.logger.info(`Deleting document: ${documentId}`);

            const response = await this.apiClient.delete<ApiResponse<string>>(
                ApiEndpoints.document.delete(documentId)
            );

            this.logger.info('Document deleted successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to delete document: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to delete document',
                error.response?.status || 500
            );
        }
    }
}