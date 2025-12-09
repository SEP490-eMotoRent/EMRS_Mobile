import { useEffect, useState } from "react";
import { container } from "../../../../../core/di/ServiceContainer";

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
                const result = await container.account.profile.getCurrent.execute();
                
                const membership = result.rawResponse.membership;
                if (membership) {
                    setDiscountPercentage(membership.discountPercentage || 0);
                    setTierName(membership.tierName || "BRONZE");
                }
            } catch (err: any) {
                console.error("Failed to fetch membership:", err);
                setError(err.message);
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