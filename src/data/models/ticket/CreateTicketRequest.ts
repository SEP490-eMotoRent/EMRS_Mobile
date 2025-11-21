export interface CreateTicketRequest {
    ticketType: number; // TicketTypeEnum as number
    title: string;
    description: string;
    bookingId: string;
    attachments?: File[] | any[]; // File[] for web, any[] for React Native
}