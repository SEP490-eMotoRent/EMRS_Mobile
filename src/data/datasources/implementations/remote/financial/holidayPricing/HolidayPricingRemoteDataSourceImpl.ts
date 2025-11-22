import { ApiEndpoints } from "../../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../../core/network/AxiosClient";
import { HolidayPricingResponse } from "../../../../../models/financial/holidayPricing/HolidayPricingResponse";
import { HolidayPricingRemoteDataSource } from "../../../../interfaces/remote/financial/holidayPricing/HolidayPricingRemoteDataSource";

export class HolidayPricingRemoteDataSourceImpl implements HolidayPricingRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async getAll(): Promise<HolidayPricingResponse[]> {
        const response = await this.axiosClient.get<ApiResponse<HolidayPricingResponse[]>>(
            ApiEndpoints.holidayPricing.getAll
        );
        return unwrapResponse(response.data);
    }

    async getById(id: string): Promise<HolidayPricingResponse> {
        const response = await this.axiosClient.get<ApiResponse<HolidayPricingResponse>>(
            ApiEndpoints.holidayPricing.getById(id)
        );
        return unwrapResponse(response.data);
    }
}