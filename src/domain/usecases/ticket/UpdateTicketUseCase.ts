
import { UpdateTicketRequest } from "../../../data/models/ticket/UpdateTicketRequest";
import { TicketRepository } from "../../repositories/ticket/TicketRepository";

export class UpdateTicketUseCase {
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(request: UpdateTicketRequest): Promise<any> {
        return this.ticketRepository.updateTicket(request);
    }
}