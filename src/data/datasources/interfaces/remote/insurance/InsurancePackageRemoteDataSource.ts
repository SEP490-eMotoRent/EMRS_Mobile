import { InsurancePackageResponse } from "../../../../models/insurance/insurancePackage/InsurancePackageResponse";

export interface InsurancePackageRemoteDataSource {
    /**
     * Fetch all insurance packages from API
     * @returns Promise with array of insurance package DTOs
     */
    getAllInsurancePackages(): Promise<InsurancePackageResponse[]>;

    /**
     * Fetch insurance package by ID from API
     * @param id - Insurance package GUID
     * @returns Promise with insurance package DTO
     */
    getInsurancePackageById(id: string): Promise<InsurancePackageResponse>;
}