import { CreateTicketRequest } from "../../../data/models/ticket/CreateTicketRequest";
import { PaginationResult } from "../../../data/models/ticket/PaginationResult";
import { TicketDetailResponse } from "../../../data/models/ticket/TicketDetailResponse";
import { TicketResponse } from "../../../data/models/ticket/TicketResponse";

export interface TicketRepository {
    createTicket(request: CreateTicketRequest): Promise<TicketDetailResponse>;
    
    getTicketsByBookingId(
        bookingId: string,
        pageSize: number,
        pageNum: number,
        orderByDescending: boolean
    ): Promise<PaginationResult<TicketResponse[]>>;
    
    getTicketById(ticketId: string): Promise<TicketDetailResponse>;
}