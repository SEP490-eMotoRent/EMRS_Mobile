import { InsurancePackage } from "../../entities/insurance/InsurancePackage";

export interface InsurancePackageRepository {
    /**
     * Get all insurance packages
     * @param activeOnly - Filter to return only active packages
     */
    getAllInsurancePackages(activeOnly?: boolean): Promise<InsurancePackage[]>;

    /**
     * Get insurance package by ID
     * @param id - Insurance package GUID
     */
    getInsurancePackageById(id: string): Promise<InsurancePackage>;

    /**
     * Get active insurance packages only
     */
    getActiveInsurancePackages(): Promise<InsurancePackage[]>;
}
