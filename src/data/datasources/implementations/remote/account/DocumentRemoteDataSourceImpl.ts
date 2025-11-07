import { ServerException } from "../../../../../core/errors/ServerException";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AppLogger } from "../../../../../core/utils/Logger";
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
            
            // ✅ CRITICAL: Add required fields first
            formData.append('DocumentNumber', request.documentNumber);
            formData.append('VerificationStatus', request.verificationStatus);

            // ✅ FIXED: Only add dates if they exist AND are valid
            if (request.issueDate) {
                // Ensure it's in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
                const isoDate = this.ensureISOFormat(request.issueDate);
                if (isoDate) {
                    formData.append('IssueDate', isoDate);
                    this.logger.info(`IssueDate appended: ${isoDate}`);
                }
            }
            
            if (request.expiryDate) {
                const isoDate = this.ensureISOFormat(request.expiryDate);
                if (isoDate) {
                    formData.append('ExpiryDate', isoDate);
                    this.logger.info(`ExpiryDate appended: ${isoDate}`);
                }
            }
            
            if (request.issuingAuthority && request.issuingAuthority.trim()) {
                formData.append('IssuingAuthority', request.issuingAuthority);
            }
            
            if (request.verifiedAt) {
                const isoDate = this.ensureISOFormat(request.verifiedAt);
                if (isoDate) {
                    formData.append('VerifiedAt', isoDate);
                }
            }

            // ✅ Add file objects for React Native FormData
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

            // ✅ Set proper headers for multipart/form-data
            const response = await this.apiClient.post<ApiResponse<DocumentDetailResponse>>(
                ApiEndpoints.document.createCitizen,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            this.logger.info('Citizen document created successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to create citizen document: ${error.message}`);
            this.logger.error(`Error response: ${JSON.stringify(error.response?.data)}`);
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
            formData.append('VerificationStatus', request.verificationStatus);

            if (request.issueDate) {
                const isoDate = this.ensureISOFormat(request.issueDate);
                if (isoDate) formData.append('IssueDate', isoDate);
            }
            
            if (request.expiryDate) {
                const isoDate = this.ensureISOFormat(request.expiryDate);
                if (isoDate) formData.append('ExpiryDate', isoDate);
            }
            
            if (request.issuingAuthority && request.issuingAuthority.trim()) {
                formData.append('IssuingAuthority', request.issuingAuthority);
            }
            
            if (request.verifiedAt) {
                const isoDate = this.ensureISOFormat(request.verifiedAt);
                if (isoDate) formData.append('VerifiedAt', isoDate);
            }

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
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            this.logger.info('Driving document created successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to create driving document: ${error.message}`);
            this.logger.error(`Error response: ${JSON.stringify(error.response?.data)}`);
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
            formData.append('VerificationStatus', request.verificationStatus);
            formData.append('IdFileFront', request.idFileFront);
            formData.append('IdFileBack', request.idFileBack);

            if (request.issueDate) {
                const isoDate = this.ensureISOFormat(request.issueDate);
                if (isoDate) formData.append('IssueDate', isoDate);
            }
            
            if (request.expiryDate) {
                const isoDate = this.ensureISOFormat(request.expiryDate);
                if (isoDate) formData.append('ExpiryDate', isoDate);
            }
            
            if (request.issuingAuthority && request.issuingAuthority.trim()) {
                formData.append('IssuingAuthority', request.issuingAuthority);
            }
            
            if (request.verifiedAt) {
                const isoDate = this.ensureISOFormat(request.verifiedAt);
                if (isoDate) formData.append('VerifiedAt', isoDate);
            }

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
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
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
            formData.append('VerificationStatus', request.verificationStatus);
            formData.append('IdFileFront', request.idFileFront);
            formData.append('IdFileBack', request.idFileBack);

            if (request.issueDate) {
                const isoDate = this.ensureISOFormat(request.issueDate);
                if (isoDate) formData.append('IssueDate', isoDate);
            }
            
            if (request.expiryDate) {
                const isoDate = this.ensureISOFormat(request.expiryDate);
                if (isoDate) formData.append('ExpiryDate', isoDate);
            }
            
            if (request.issuingAuthority && request.issuingAuthority.trim()) {
                formData.append('IssuingAuthority', request.issuingAuthority);
            }
            
            if (request.verifiedAt) {
                const isoDate = this.ensureISOFormat(request.verifiedAt);
                if (isoDate) formData.append('VerifiedAt', isoDate);
            }

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
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
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

    /**
     * ✅ Helper: Ensure date is in ISO 8601 format
     * Handles: DD/MM/YYYY, YYYY-MM-DD, or already ISO strings
     */
    private ensureISOFormat(dateInput: string): string | null {
        if (!dateInput || !dateInput.trim()) return null;

        try {
            // If already in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
            if (/^\d{4}-\d{2}-\d{2}/.test(dateInput)) {
                return dateInput;
            }

            // If in DD/MM/YYYY format, convert to YYYY-MM-DD
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
                const [day, month, year] = dateInput.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }

            this.logger.warn(`Invalid date format: ${dateInput}`);
            return null;
        } catch (error) {
            this.logger.error(`Date conversion error: ${error}`);
            return null;
        }
    }
}