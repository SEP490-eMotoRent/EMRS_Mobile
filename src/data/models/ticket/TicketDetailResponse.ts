export interface TicketDetailResponse {
    id: string;
    ticketType: string;
    title: string;
    description: string;
    status: string;
    bookingId: string;
    staffId: string | null;
    createdAt: string;
    attachments: MediaResponseDTO[] | null;
}

export interface MediaResponseDTO {
    id: string;
    mediaType: string;
    fileUrl: string;
    docNo: string;
    entityType: string;
}