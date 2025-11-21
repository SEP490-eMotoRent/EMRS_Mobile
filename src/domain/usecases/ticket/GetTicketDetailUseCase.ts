import { TicketDetailResponse } from "../../../data/models/ticket/TicketDetailResponse";
import { TicketRepository } from "../../repositories/ticket/TicketRepository";

export class GetTicketDetailUseCase {
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(ticketId: string): Promise<TicketDetailResponse> {
        return this.ticketRepository.getTicketById(ticketId);
    }
}