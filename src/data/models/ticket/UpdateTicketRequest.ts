export interface UpdateTicketRequest {
    id: string;
    status: string;
    staffId?: string | null;
}