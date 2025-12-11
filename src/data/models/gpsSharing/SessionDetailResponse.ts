// {
//     "sessionId": "019ad3ce-4710-7537-8d1e-df5783e73a82",
//     "invitationCode": "K5KCWZ",
//     "status": "Active",
//     "invitationExpiresAt": null,
//     "sessionExpiresAt": "2025-12-01T08:10:28.375298+00:00",
//     "acceptedAt": "2025-11-30T08:10:28.375272+00:00",
//     "ownerInfo": {
//       "renterId": "019ac77a-4ff9-75be-b526-b1ea3b877d8f",
//       "renterName": "phuuthanh2003",
//       "vehicle": {
//         "id": "806923fb-0360-47f2-8535-3a52e1f2b704",
//         "licensePlate": "59K1-33345",
//         "color": "Đỏ đen thể thao",
//         "yearOfManufacture": "2024-02-01T00:00:00Z",
//         "currentOdometerKm": 680,
//         "batteryHealthPercentage": 97,
//         "status": "Rented",
//         "purchaseDate": "2024-01-28T00:00:00Z",
//         "description": "Xe cao cấp hiệu suất mạnh mẽ tốc độ cao",
//         "rentalPricing": null,
//         "tempTrackingPayload": {
//           "vehicleId": "806923fb-0360-47f2-8535-3a52e1f2b704",
//           "imei": "355468593172349",
//           "deviceId": 7354990,
//           "exp": 1764579909,
//           "tmpToken": "MjopOhswAugoSPSS7IzryXsXgFlA8oqK6r65cLRcMzQ8CgIdXQUWik7GSdNXEi6I"
//         }
//       }
//     },
//     "guestInfo": {
//       "renterId": "019ad3b1-58ef-77f9-86a1-88ea70c7e670",
//       "renterName": "phuuthanh20033",
//       "vehicle": {
//         "id": "7e4c7e3e-339f-43cf-b5d1-6e871c5af65a",
//         "licensePlate": "59K1-22345",
//         "color": "Đen",
//         "yearOfManufacture": "2024-01-25T00:00:00Z",
//         "currentOdometerKm": 320,
//         "batteryHealthPercentage": 99,
//         "status": "Rented",
//         "purchaseDate": "2024-01-20T00:00:00Z",
//         "description": "Thiết kế trẻ trung phù hợp công sở",
//         "rentalPricing": null,
//         "tempTrackingPayload": {
//           "vehicleId": "7e4c7e3e-339f-43cf-b5d1-6e871c5af65a",
//           "imei": "355468592699953",
//           "deviceId": 7263099,
//           "exp": 1764579910,
//           "tmpToken": "Eh0QPEWV6M308ZM2SPBP4CLLn9CGWLvxTL6pQJiqUPv63ruhXFW7SKczhiZwN0iO"
//         }
//       }
//     }
//   },

export interface SessionDetailResponse {
  sessionId: string;
  invitationCode: string;
  status: string;
  invitationExpiresAt: string;
  sessionExpiresAt: string;
  acceptedAt: string;
  ownerInfo: OwnerInfo;
  guestInfo: GuestInfo;
}

export interface OwnerInfo {
  renterId: string;
  renterName: string;
  vehicle: VehicleDetailResponse;
  avatarRenter: string;
}

export interface GuestInfo {
  renterId: string;
  renterName: string;
  vehicle: VehicleDetailResponse;
  avatarRenter: string;
}

export interface VehicleDetailResponse {
  id: string;
  licensePlate: string;
  color: string;
  yearOfManufacture: string;
  currentOdometerKm: number;
  batteryHealthPercentage: number;
  status: string;
  purchaseDate: string;
  description: string;
  tempTrackingPayload: TempTrackingPayload;
}

export interface TempTrackingPayload {
  vehicleId: string;
  imei: string;
  deviceId: number;
  exp: number;
  tmpToken: string;
}