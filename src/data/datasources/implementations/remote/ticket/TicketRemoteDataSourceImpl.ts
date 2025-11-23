import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";

import { CreateTicketRequest } from "../../../../models/ticket/CreateTicketRequest";
import { TicketDetailResponse } from "../../../../models/ticket/TicketDetailResponse";
import { PaginationResult } from "../../../../models/ticket/PaginationResult";
import { TicketResponse } from "../../../../models/ticket/TicketResponse";
import { TicketRemoteDataSource } from "../../../interfaces/remote/ticket/TicketRemoteDataSource";
import { UpdateTicketRequest } from "../../../../models/ticket/UpdateTicketRequest";

export class TicketRemoteDataSourceImpl implements TicketRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async createTicket(request: CreateTicketRequest): Promise<TicketDetailResponse> {
        const formData = new FormData();
        
        formData.append('TicketType', request.ticketType.toString());
        formData.append('Title', request.title);
        formData.append('Description', request.description);
        formData.append('BookingId', request.bookingId);
        
        if (request.attachments && request.attachments.length > 0) {
            request.attachments.forEach((file) => {
                formData.append('Attachments', file);
            });
        }

        const response = await this.axiosClient.post<ApiResponse<TicketDetailResponse>>(
            ApiEndpoints.ticket.create,
            formData
        );
        return unwrapResponse(response.data);
    }

    async getTicketsByBookingId(
        bookingId: string,
        pageSize: number,
        pageNum: number,
        orderByDescending: boolean
    ): Promise<PaginationResult<TicketResponse[]>> {
        const response = await this.axiosClient.get<ApiResponse<PaginationResult<TicketResponse[]>>>(
            ApiEndpoints.ticket.byBookingId(bookingId),
            {
                params: {
                    pageSize,
                    pageNum,
                    orderByDescending
                }
            }
        );
        return unwrapResponse(response.data);
    }

    async getTicketById(ticketId: string): Promise<TicketDetailResponse> {
        const response = await this.axiosClient.get<ApiResponse<TicketDetailResponse>>(
            ApiEndpoints.ticket.detail(ticketId)
        );
        return unwrapResponse(response.data);
    }

    async getTicketsByStaffId(staffId: string, pageSize: number, pageNum: number, orderByDescending: boolean): Promise<PaginationResult<TicketResponse[]>> {
        const response = await this.axiosClient.get<ApiResponse<PaginationResult<TicketResponse[]>>>(
            ApiEndpoints.ticket.byStaffId(staffId),
            {
                params: {
                    pageSize,
                    pageNum,
                    orderByDescending
                }
            }
        );
        return unwrapResponse(response.data);
    }

    async updateTicket(request: UpdateTicketRequest): Promise<TicketDetailResponse> {
        const response = await this.axiosClient.put<ApiResponse<TicketDetailResponse>>(
            ApiEndpoints.ticket.update,
            request
        );
        return unwrapResponse(response.data);
    }
}