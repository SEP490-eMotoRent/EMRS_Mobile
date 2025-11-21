import { TicketRemoteDataSource } from "../../datasources/interfaces/remote/ticket/TicketRemoteDataSource";
import { CreateTicketRequest } from "../../models/ticket/CreateTicketRequest";
import { PaginationResult } from "../../models/ticket/PaginationResult";
import { TicketDetailResponse } from "../../models/ticket/TicketDetailResponse";
import { TicketResponse } from "../../models/ticket/TicketResponse";
import { TicketRepository } from "../../../domain/repositories/ticket/TicketRepository";

export class TicketRepositoryImpl implements TicketRepository {
    constructor(private remoteDataSource: TicketRemoteDataSource) {}

    async createTicket(request: CreateTicketRequest): Promise<TicketDetailResponse> {
        return this.remoteDataSource.createTicket(request);
    }

    async getTicketsByBookingId(
        bookingId: string,
        pageSize: number,
        pageNum: number,
        orderByDescending: boolean
    ): Promise<PaginationResult<TicketResponse[]>> {
        return this.remoteDataSource.getTicketsByBookingId(
            bookingId,
            pageSize,
            pageNum,
            orderByDescending
        );
    }

    async getTicketById(ticketId: string): Promise<TicketDetailResponse> {
        return this.remoteDataSource.getTicketById(ticketId);
    }
}