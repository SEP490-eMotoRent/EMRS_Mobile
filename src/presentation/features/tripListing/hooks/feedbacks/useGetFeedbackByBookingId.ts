import { useCallback, useEffect, useState } from "react";
import { Feedback } from "../../../../../domain/entities/booking/Feedback";
import { GetFeedbackByBookingIdUseCase } from "../../../../../domain/usecases/feedback/GetFeedbackByBookingIdUseCase";

interface UseGetFeedbackByBookingIdResult {
    feedbacks: Feedback[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    hasFeedback: boolean;
}

export const useGetFeedbackByBookingId = (
    useCase: GetFeedbackByBookingIdUseCase,
    bookingId: string | null
): UseGetFeedbackByBookingIdResult => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFeedbacks = useCallback(async () => {
        if (!bookingId) {
            setFeedbacks([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await useCase.execute(bookingId);
            setFeedbacks(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể tải đánh giá";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [useCase, bookingId]);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    return {
        feedbacks,
        loading,
        error,
        refetch: fetchFeedbacks,
        hasFeedback: feedbacks.length > 0,
    };
};