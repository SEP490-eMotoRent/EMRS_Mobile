import { CreateTicketRequest } from "../../../data/models/ticket/CreateTicketRequest";
import { TicketDetailResponse } from "../../../data/models/ticket/TicketDetailResponse";
import { TicketRepository } from "../../repositories/ticket/TicketRepository";

export class CreateTicketUseCase {
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(request: CreateTicketRequest): Promise<TicketDetailResponse> {
        return this.ticketRepository.createTicket(request);
    }
}