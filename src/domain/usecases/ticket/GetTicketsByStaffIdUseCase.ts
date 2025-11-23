import { PaginationResult } from "../../../data/models/ticket/PaginationResult";
import { TicketResponse } from "../../../data/models/ticket/TicketResponse";
import { TicketRepository } from "../../repositories/ticket/TicketRepository";

export interface GetTicketsByStaffIdParams {
    staffId: string;
    pageSize?: number;
    pageNum?: number;
    orderByDescending?: boolean;
}

export class GetTicketsByStaffIdUseCase {
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(params: GetTicketsByStaffIdParams): Promise<PaginationResult<TicketResponse[]>> {
        const { 
            staffId, 
            pageSize = 10, 
            pageNum = 1, 
            orderByDescending = true 
        } = params;
        
        return this.ticketRepository.getTicketsByStaffId(
            staffId,
            pageSize,
            pageNum,
            orderByDescending
        );
    }
}