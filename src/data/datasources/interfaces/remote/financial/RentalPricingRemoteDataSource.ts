import { CreateRentalPricingRequest } from "../../../../models/financial/rentalPricing/CreateRentalPricingRequest";
import { RentalPricingResponse } from "../../../../models/financial/rentalPricing/RentalPricingResponse";


export interface RentalPricingRemoteDataSource {
    create(request: CreateRentalPricingRequest): Promise<RentalPricingResponse>;
    getAll(): Promise<RentalPricingResponse[]>;
    getById(id: string): Promise<RentalPricingResponse | null>;
}