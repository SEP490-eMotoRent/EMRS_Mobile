import { useCallback, useEffect, useState } from "react";
import { Feedback } from "../../../../domain/entities/booking/Feedback";
import { GetAllFeedbacksUseCase } from "../../../../domain/usecases/feedback/GetAllFeedbacksUseCase";

interface UseGetAllFeedbacksResult {
    feedbacks: Feedback[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useGetAllFeedbacks = (
    useCase: GetAllFeedbacksUseCase
): UseGetAllFeedbacksResult => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeedbacks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await useCase.execute();
            setFeedbacks(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể tải đánh giá";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [useCase]);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    return {
        feedbacks,
        loading,
        error,
        refetch: fetchFeedbacks,
    };
};