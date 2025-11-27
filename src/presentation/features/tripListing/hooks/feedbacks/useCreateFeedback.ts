import { useState } from "react";
import { CreateFeedbackInput, Feedback } from "../../../../../domain/entities/booking/Feedback";
import { CreateFeedbackUseCase } from "../../../../../domain/usecases/feedback/CreateFeedbackUseCase";

interface UseCreateFeedbackResult {
    createFeedback: (input: CreateFeedbackInput, onSuccess?: (feedback: Feedback) => void) => Promise<void>;
    loading: boolean;
    error: string | null;
    success: boolean;
    reset: () => void;
}

export const useCreateFeedback = (
    useCase: CreateFeedbackUseCase
): UseCreateFeedbackResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createFeedback = async (
        input: CreateFeedbackInput,
        onSuccess?: (feedback: Feedback) => void
    ) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await useCase.execute(input);
            setSuccess(true);
            onSuccess?.(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể gửi đánh giá";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return {
        createFeedback,
        loading,
        error,
        success,
        reset,
    };
};