import { useState } from "react";
import { Alert } from "react-native";
import { CreateTicketRequest } from "../../../../../data/models/ticket/CreateTicketRequest";
import { TicketDetailResponse } from "../../../../../data/models/ticket/TicketDetailResponse";
import { CreateTicketUseCase } from "../../../../../domain/usecases/ticket/CreateTicketUseCase";

interface UseCreateTicketResult {
    createTicket: (request: CreateTicketRequest) => Promise<TicketDetailResponse | null>;
    loading: boolean;
    error: string | null;
}

export const useCreateTicket = (
    createTicketUseCase: CreateTicketUseCase
): UseCreateTicketResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTicket = async (
        request: CreateTicketRequest
    ): Promise<TicketDetailResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            
            // console.log(" Creating ticket:", request);
            const result = await createTicketUseCase.execute(request);
            // console.log(" Ticket created:", result.id);
            
            return result;
        } catch (err: any) {
            const errorMessage = err.message || "Không thể tạo ticket";
            console.error("❌ Failed to create ticket:", errorMessage);
            setError(errorMessage);
            Alert.alert("Lỗi", errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createTicket,
        loading,
        error,
    };
};