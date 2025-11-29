import { NavigatorScreenParams } from "@react-navigation/native";
import { ScanFaceResponse } from "../../../../data/models/account/renter/ScanFaceResponse";
import { AnalyzeReturnResponse } from "../../../../data/models/rentalReturn/AnalyzeReturnResponse";
import { VehicleModel } from "../../../../domain/entities/vehicle/VehicleModel";

export type AuthStackParamList = {
  Hello: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  AdditionalInfo: {
    email: string;
    password: string;
  };
  OTPVerification: {
    email: string;
    userId: string;
  };
};

export type HomeStackParamList = {
  Home: undefined;
  Browse: NavigatorScreenParams<BrowseStackParamList>;
  Booking: NavigatorScreenParams<BookingStackParamList>;
  ListView: {
    location: string;
    dateRange: string;
    address: string;
  };
  Map: {
    location: string;
    dateRange: string;
    address: string;
  };
  VehicleDetails: {
    vehicleId: string;
    dateRange: string;
    location?: string;
  };
};

export type BrowseStackParamList = {
  Map: {
    location: string;
    dateRange: string;
    address: string;
  };
  ListView: {
    location: string;
    dateRange: string;
    address: string;
  };
  VehicleDetails: {
    vehicleId: string;
    dateRange: string;
    location?: string;
  };

    // Document Management Screens
  DocumentManagement: undefined;
  CitizenIDVerification: undefined;
  DriverLicenseVerification: undefined;
  DocumentCapture: {
    documentType: 'citizen' | 'license';
    side: 'front' | 'back';
    onPhotoTaken: (uri: string, side: 'front' | 'back') => void;
  };
};

export type BookingStackParamList = {
  ConfirmRentalDuration: { 
      vehicleId: string;
      vehicleName: string;
      vehicleImageUrl?: string;
      branchId: string;
      branchName: string;
      pricePerDay: number;
      securityDeposit: number;
      branchOpenTime?: string;
      branchCloseTime?: string;
      vehicleCategory: string;
      dateRange?: string;
  };
  InsurancePlans: {
      vehicleId: string;
      vehicleName: string;
      vehicleImageUrl?: string;
      branchId: string;
      branchName: string;
      pricePerDay: number;
      securityDeposit: number;
      startDate: string;
      endDate: string;
      duration: string;
      rentalDays: number;
      rentalPrice: number;
      baseRentalFee: number;
      rentingRate: number;
      averageRentalPrice: number;
      vehicleCategory: string;
      holidaySurcharge: number;
      holidayDayCount: number;
      // NEW: Membership data
      membershipDiscountPercentage: number;
      membershipDiscountAmount: number;
      membershipTier: string;
  };
  PaymentConfirmation: {
    vehicleId: string;
    vehicleName: string;
    vehicleImageUrl?: string;
    branchId: string;
    branchName: string;
    startDate: string;
    pricePerDay: number;
    endDate: string;
    duration: string;
    rentalDays: number;
    insurancePlan: string;
    insurancePlanId?: string;
    rentalFee: string;
    insuranceFee: string;
    securityDeposit: string;
    total: string;
    baseRentalFee: number;
    rentingRate: number;
    averageRentalPrice: number;
    vehicleCategory: string;
    holidaySurcharge: number;
    holidayDayCount: number;
    membershipDiscountPercentage: number;
    membershipDiscountAmount: number;
    membershipTier: string;
  };
  VNPayWebView: {
      vnpayUrl: string;
      bookingId: string;
      expiresAt: string;
      vehicleName: string;
      totalAmount: string;
      vehicleId: string;
      vehicleImageUrl: string;
      startDate: string;
      endDate: string;
      duration: string;
      rentalDays: number;
      branchName: string;
      insurancePlan: string;
      securityDeposit: string;
  };
  VNPayCallback: {
    vnp_ResponseCode?: string;
    vnp_TxnRef?: string;
    vnp_Amount?: string;
    vnp_OrderInfo?: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;
    vnp_SecureHash?: string;
  };
  PaymentProcessing: {
    bookingId: string;
    vehicleName: string;
    totalAmount: string;
    vehicleId: string;
    vehicleImageUrl?: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
    branchName: string;
    insurancePlan: string;
    securityDeposit: string;
  };
  PaymentFailed: {
    bookingId: string;
    vehicleName: string;
    errorMessage?: string;
  };
  DigitalContract: {
    vehicleId: string;
    vehicleName: string;
    vehicleImageUrl?: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
    branchName: string;
    insurancePlan: string;
    totalAmount: string;
    securityDeposit: string;
    contractNumber: string;
  };
  Trips: undefined;
};

export type TripStackParamList = {
  Trip: undefined;
  BookingDetails: {
    bookingId: string;
  };
  HandoverReceiptReport: {
    bookingId: string;
    rentalReceiptId?: string;
  };
  ReturnReport: {
    bookingId: string;
    rentalReceiptId: string;
    settlement: {
      baseRentalFee: number;
      depositAmount: number;
      totalAmount: number;
      totalChargingFee: number;
      totalAdditionalFees: number;
      refundAmount: number;
      feesBreakdown: {
        cleaningFee: number;
        crossBranchFee: number;
        damageFee: number;
        excessKmFee: number;
        lateReturnFee: number;
      };
    };
  };
  SignContract: {
    bookingId: string;
    email: string;
    fullName: string;
    receiptId: string;
  };
  EmergencyContact: {
    bookingId: string;
    rentalDetails: {
      bikeModel: string;
      licensePlate: string;
      branch: string;
    };
  };
  CreateTicket: {
    bookingId: string;
    vehicleName: string;
    licensePlate?: string;
  };
  TicketList: {
      bookingId: string;
  };
  TicketDetail: {
      ticketId: string;
  };
  IncidentReport: {
    bookingId: string;
    initialData?: {
      dateTime: string;
      location: string;
      address: string;
    };
  };
  IncidentPhotoCapture: {
    bookingId: string;
    onPhotoTaken: (uri: string) => void;
  };
  TrackingGPS: {
    vehicleId?: string;
    licensePlate?: string;
  };
  ReturnComplete: undefined;
  RentedVehicleDetails: {
    vehicleId: string;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  DocumentManagement: undefined;
  CitizenIDVerification: undefined;
  DriverLicenseVerification: undefined;
  DocumentCapture: {
    documentType: 'citizen' | 'license';
    side: 'front' | 'back';
    onPhotoTaken: (uri: string, side: 'front' | 'back') => void;
  };
  //Coi những claims bảo hiểm của mình:
  InsuranceClaims: undefined;
  InsuranceClaimDetail: {
    claimId: string;
  };
  Auth: NavigatorScreenParams<AuthStackParamList>;

  CreateWithdrawalRequest: undefined;
  WithdrawalRequestList: undefined;
  WithdrawalRequestDetail: {
    requestId: string;
  };
  
  WalletTopUp: undefined;
  WalletVNPayWebView: {
      vnpayUrl: string;
      transactionId: string;
      amount: number;
      expiresAt: string;
  };
  WalletTopUpResult: {
      success: boolean;
      amount: number;
      transactionId?: string;
      errorMessage?: string;
  };
  AllTransactions: undefined;
};

export type BatteryStackParamList = {
  BranchMap: undefined;
};

export type StaffStackParamList = {
  Home: undefined;
  AllVehicles: undefined;
  MotorbikeDetail: { motorbikeId: string } | undefined;
  Rental: undefined;
  Return: undefined;
  ScanFace: undefined;
  FaceScanCamera: undefined;
  ScanResult: { renter: ScanFaceResponse };
  ScanCitizenResult: { renter: ScanFaceResponse };
  CustomerRentals: { renterId: string };
  SelectVehicle: {
    bookingId: string;
    renterName: string;
    vehicleModel: VehicleModel;
    vehicleStatus?: string;
    isChangeVehicle?: boolean;
  };
  VehicleInspection: {
    vehicleId: string;
    bookingId: string;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    isChangeVehicle?: boolean;
  };
  HandoverReport: {
    receiptId: string;
    notes: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    bookingId: string;
    vehicleFiles: string[];
    checkListFile: string;
  };
  HandoverReceiptReport: {
    bookingId: string;
    rentalReceiptId?: string;
  };
  AwaitingApproval: { status?: "pending" | "approved" | "denied" } | undefined;
  HandoverDocument: undefined;
  HandoverComplete: undefined;
  BookingDetails: { bookingId?: string; booking?: any };
  Charging: undefined;
  Profile: undefined;
  VehicleConfirmation: {
    bookingId: string;
    vehicleId: string;
  };
  ReturnInspection: { bookingId: string };
  AIAnalysis: { bookingId: string; analyzeReturnData: AnalyzeReturnResponse };
  ManualInspection: { bookingId: string; photos: string[] };
  AdditionalFees: {
    endOdometerKm: number;
    endBatteryPercentage: number;
    bookingId: string;
    returnImageUrls: string[];
    checkListImage: string;
  };
  ReturnReport: {
    bookingId: string;
    rentalReceiptId: string;
    settlement: {
      baseRentalFee: number;
      depositAmount: number;
      totalAmount: number;
      totalChargingFee: number;
      totalAdditionalFees: number;
      refundAmount: number;
      feesBreakdown: {
        cleaningFee: number;
        crossBranchFee: number;
        damageFee: number;
        excessKmFee: number;
        lateReturnFee: number;
      };
    };
  };
  SignContract: {
    bookingId: string;
    email: string;
    fullName: string;
    receiptId: string;
  };
  TrackingGPS: {
    vehicleId?: string;
    licensePlate?: string;
  };
  BookingReturnList: { renterId: string };
  RentedVehicleDetails: {
    vehicleId: string;
  };
  TicketList: {
    bookingId: string;
  };
  TicketDetail: {
    ticketId: string;
  };
};

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Staff: undefined;
};