import { useEffect, useState } from "react";
import sl from "../../../../../core/di/InjectionContainer";

interface MembershipDiscountResult {
    discountPercentage: number;
    tierName: string;
    loading: boolean;
    error: string | null;
}

export const useMembershipDiscount = (): MembershipDiscountResult => {
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [tierName, setTierName] = useState("BRONZE");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembership = async () => {
            try {
                setLoading(true);
                const getCurrentRenterUseCase = sl.getGetCurrentRenterUseCase();
                const result = await getCurrentRenterUseCase.execute();
                
                const membership = result.rawResponse.membership;
                if (membership) {
                    setDiscountPercentage(membership.discountPercentage || 0);
                    setTierName(membership.tierName || "BRONZE");
                }
            } catch (err: any) {
                console.error("Failed to fetch membership:", err);
                setError(err.message);
                // Default to no discount on error
                setDiscountPercentage(0);
            } finally {
                setLoading(false);
            }
        };

        fetchMembership();
    }, []);

    return {
        discountPercentage,
        tierName,
        loading,
        error,
    };
};