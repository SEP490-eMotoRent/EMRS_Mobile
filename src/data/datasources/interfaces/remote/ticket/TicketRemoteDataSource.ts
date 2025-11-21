import { CreateTicketRequest } from "../../../../models/ticket/CreateTicketRequest";
import { PaginationResult } from "../../../../models/ticket/PaginationResult";
import { TicketDetailResponse } from "../../../../models/ticket/TicketDetailResponse";
import { TicketResponse } from "../../../../models/ticket/TicketResponse";

export interface TicketRemoteDataSource {
    createTicket(request: CreateTicketRequest): Promise<TicketDetailResponse>;
    
    getTicketsByBookingId(
        bookingId: string,
        pageSize: number,
        pageNum: number,
        orderByDescending: boolean
    ): Promise<PaginationResult<TicketResponse[]>>;
    
    getTicketById(ticketId: string): Promise<TicketDetailResponse>;
}