export type AuthStackParamList = {
  Hello: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Schedule: undefined;
  Battery: undefined;
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
  ConfirmRentalDuration: { vehicleId: number }; // ✅ ADDED
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
  AwaitingApproval: undefined;
  BookingDetails: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Profile: undefined;
  Staff: undefined;
};