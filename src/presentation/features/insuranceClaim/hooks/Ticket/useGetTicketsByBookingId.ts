import { useCallback, useEffect, useState } from "react";
import { TicketResponse } from "../../../../../data/models/ticket/TicketResponse";
import { GetTicketsByBookingIdUseCase } from "../../../../../domain/usecases/ticket/GetTicketsByBookingIdUseCase";


interface UseGetTicketsByBookingIdResult {
    tickets: TicketResponse[];
    loading: boolean;
    error: string | null;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    refetch: () => void;
    loadMore: () => void;
    hasMore: boolean;
}

export const useGetTicketsByBookingId = (
    bookingId: string,
    getTicketsByBookingIdUseCase: GetTicketsByBookingIdUseCase,
    pageSize: number = 10
): UseGetTicketsByBookingIdResult => {
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchTickets = useCallback(async (page: number, append: boolean = false) => {
        if (!bookingId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await getTicketsByBookingIdUseCase.execute({
                bookingId,
                pageSize,
                pageNum: page,
                orderByDescending: true,
            });

            console.log("📋 Tickets loaded:", result.items.length);

            if (append) {
                setTickets((prev) => [...prev, ...result.items]);
            } else {
                setTickets(result.items);
            }

            setCurrentPage(result.currentPage);
            setTotalPages(result.totalPages);
            setTotalItems(result.totalItems);
        } catch (err: any) {
            console.error("❌ Failed to load tickets:", err);
            setError(err.message || "Không thể tải danh sách ticket");
        } finally {
            setLoading(false);
        }
    }, [bookingId, getTicketsByBookingIdUseCase, pageSize]);

    useEffect(() => {
        fetchTickets(1, false);
    }, [fetchTickets]);

    const refetch = useCallback(() => {
        setCurrentPage(1);
        fetchTickets(1, false);
    }, [fetchTickets]);

    const loadMore = useCallback(() => {
        if (currentPage < totalPages && !loading) {
            fetchTickets(currentPage + 1, true);
        }
    }, [currentPage, totalPages, loading, fetchTickets]);

    const hasMore = currentPage < totalPages;

    return {
        tickets,
        loading,
        error,
        totalItems,
        currentPage,
        totalPages,
        refetch,
        loadMore,
        hasMore,
    };
};