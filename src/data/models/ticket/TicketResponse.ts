export interface TicketResponse {
    id: string;
    ticketType: string;
    title: string;
    description: string;
    status: string;
    bookingId: string;
    staffId: string | null;
    createdAt: string; // ISO date string
}