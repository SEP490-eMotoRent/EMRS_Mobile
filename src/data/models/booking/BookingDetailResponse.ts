import { AdditionalFeeResponse } from "./AdditionalFeeResponse";
import { 
    RenterBookingResponse, 
    VehicleBookingResponse, 
    VehicleModelBookingResponse,
    RentalContractBookingResponse,
    RentalReceiptBookingResponse,
    InsurancePackageBookingResponse,
    BranchBookingResponse
} from "./staffResponse/BookingResponseForStaff";

/**
 * Full booking detail response (includes ALL nested objects and additional fees)
 * Used when fetching booking by ID
 */
export interface BookingDetailResponse {
    id: string;
    startDatetime?: Date;
    endDatetime?: Date;
    actualReturnDatetime?: Date;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    lateReturnFee: number;
    averageRentalPrice: number;
    excessKmFee: number;
    cleaningFee: number;
    crossBranchFee: number;
    totalChargingFee: number;
    totalAdditionalFee: number;
    earlyHandoverFee?: number;
    refundAmount: number;
    totalRentalFee: number;
    totalAmount: number;
    bookingCode: string;
    bookingStatus: string;
    
    handoverBranch?: BranchBookingResponse;
    returnBranch?: BranchBookingResponse;
    insurancePackage?: InsurancePackageBookingResponse;
    vehicle?: VehicleBookingResponse;
    vehicleModel?: VehicleModelBookingResponse;
    renter?: RenterBookingResponse;
    rentalContract?: RentalContractBookingResponse;
    rentalReceipt?: RentalReceiptBookingResponse[];
    
    additionalFees?: AdditionalFeeResponse[];
}