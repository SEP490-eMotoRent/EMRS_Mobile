import { NavigatorScreenParams } from '@react-navigation/native';

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
  Browse: NavigatorScreenParams<BrowseStackParamList>; // NOT undefined
  Booking: NavigatorScreenParams<BookingStackParamList>; // NOT undefined
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
  VehicleDetails: { vehicleId: string };
};

export type BookingStackParamList = {
  ConfirmRentalDuration: {
    vehicleId: string;
  };
  InsurancePlans: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
  };
  PaymentConfirmation: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
    branchName: string;
    insurancePlan: string;
    insurancePlanId: string;
    rentalFee: string;
    insuranceFee: string;
    securityDeposit: string;
    serviceFee: string;
    total: string;
  };
  DigitalContract: {
    vehicleId: string;
    vehicleName: string;
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
};

export type TripStackParamList = {
  Trip: undefined;
  BookingDetails: {
    tripId: string;
    bookingReference: string;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type StaffStackParamList = {
  Home: undefined;
  MotorbikeDetail: { motorbikeId: string } | undefined;
  Rental: undefined;
  Return: undefined;
  ScanFace: undefined;
  ScanResult: undefined;
  CustomerRentals: undefined;
  SelectVehicle: { bookingId: string };
  VehicleInspection: { bookingId: string, currentOdometerKm: number, batteryHealthPercentage: number };
  HandoverReport: { 
    receiptId: string;
    notes: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    bookingId: string;
    vehicleFiles: string[];
    checkListFile: string;
  };
  AwaitingApproval: { status?: 'pending' | 'approved' | 'denied' } | undefined;
  HandoverDocument: undefined;
  HandoverComplete: undefined;
  BookingDetails: { bookingId: string };
  Charging: undefined;
  Profile: undefined;
  VehicleConfirmation: undefined;
  ReturnInspection: undefined;
  AIAnalysis: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined; // This is NavigationBarNavigator with all tabs
  Staff: undefined;
};