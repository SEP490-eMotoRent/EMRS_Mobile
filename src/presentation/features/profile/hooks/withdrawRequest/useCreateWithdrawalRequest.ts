import { useState } from "react";
import sl from "../../../../../core/di/InjectionContainer";

export const useCreateWithdrawalRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createUseCase = sl.getCreateWithdrawalRequestUseCase();

    const createRequest = async (
        amount: number,
        bankName: string,
        bankAccountNumber: string,
        bankAccountName: string
    ) => {
        setLoading(true);
        setError(null);

        console.log("🚀 [CREATE WITHDRAWAL] Starting request...");
        console.log("📊 [CREATE WITHDRAWAL] Params:", {
        amount,
        bankName,
        bankAccountNumber,
        bankAccountName,
        });

        try {
        const result = await createUseCase.execute(
            amount,
            bankName,
            bankAccountNumber,
            bankAccountName
        );
        console.log("✅ [CREATE WITHDRAWAL] Success:", result);
        return result;
        } catch (err: any) {
        console.error("❌ [CREATE WITHDRAWAL] Error:", err);
        console.error("❌ [CREATE WITHDRAWAL] Error message:", err.message);
        console.error("❌ [CREATE WITHDRAWAL] Error stack:", err.stack);
        const errorMessage = err.message || "Không thể tạo yêu cầu rút tiền";
        setError(errorMessage);
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return {
        createRequest,
        loading,
        error,
    };
};