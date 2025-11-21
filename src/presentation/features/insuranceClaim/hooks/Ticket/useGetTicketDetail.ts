import { useCallback, useEffect, useState } from "react";
import { TicketDetailResponse } from "../../../../../data/models/ticket/TicketDetailResponse";
import { GetTicketDetailUseCase } from "../../../../../domain/usecases/ticket/GetTicketDetailUseCase";

interface UseGetTicketDetailResult {
    ticket: TicketDetailResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useGetTicketDetail = (
    ticketId: string,
    getTicketDetailUseCase: GetTicketDetailUseCase
): UseGetTicketDetailResult => {
    const [ticket, setTicket] = useState<TicketDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTicket = useCallback(async () => {
        if (!ticketId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await getTicketDetailUseCase.execute(ticketId);
            console.log("🎫 Ticket detail loaded:", result.id);
            setTicket(result);
        } catch (err: any) {
            console.error("❌ Failed to load ticket detail:", err);
            setError(err.message || "Không thể tải chi tiết ticket");
        } finally {
            setLoading(false);
        }
    }, [ticketId, getTicketDetailUseCase]);

    useEffect(() => {
        fetchTicket();
    }, [fetchTicket]);

    const refetch = useCallback(() => {
        fetchTicket();
    }, [fetchTicket]);

    return {
        ticket,
        loading,
        error,
        refetch,
    };
};