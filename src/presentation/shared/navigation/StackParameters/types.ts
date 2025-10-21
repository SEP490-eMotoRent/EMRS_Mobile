import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Hello: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
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
  VehicleDetails: { vehicleId: number };
};

export type BookingStackParamList = {
  ConfirmRentalDuration: { vehicleId: number };
  InsurancePlans: {
    vehicleId: number;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
  };
  PaymentConfirmation: {
    vehicleId: number;
    startDate: string;
    endDate: string;
    duration: string;
    branchName: string;
    insurancePlan: string;
    rentalFee: string;
    insuranceFee: string;
    securityDeposit: string;
    serviceFee: string;
    total: string;
  };
  DigitalContract: {
    vehicleId: number;
    vehicleName: string;
    startDate: string;
    endDate: string;
    duration: string;
    branchName: string;
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
};

export type StaffStackParamList = {
  Handover: undefined;
  Return: undefined;
  ScanFace: undefined;
  ScanResult: undefined;
  CustomerRentals: undefined;
  SelectVehicle: undefined;
  VehicleInspection: undefined;
  HandoverReport: undefined;
  AwaitingApproval: { status?: 'pending' | 'approved' | 'denied' } | undefined;
  HandoverDocument: undefined;
  HandoverComplete: undefined;
  BookingDetails: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined; // This is NavigationBarNavigator with all tabs
  Staff: undefined;
};