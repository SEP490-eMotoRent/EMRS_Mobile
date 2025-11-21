import { PaginationResult } from "../../../data/models/ticket/PaginationResult";
import { TicketResponse } from "../../../data/models/ticket/TicketResponse";
import { TicketRepository } from "../../repositories/ticket/TicketRepository";

export interface GetTicketsByBookingIdParams {
    bookingId: string;
    pageSize?: number;
    pageNum?: number;
    orderByDescending?: boolean;
}

export class GetTicketsByBookingIdUseCase {
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(params: GetTicketsByBookingIdParams): Promise<PaginationResult<TicketResponse[]>> {
        const { 
            bookingId, 
            pageSize = 10, 
            pageNum = 1, 
            orderByDescending = true 
        } = params;
        
        return this.ticketRepository.getTicketsByBookingId(
            bookingId,
            pageSize,
            pageNum,
            orderByDescending
        );
    }
}