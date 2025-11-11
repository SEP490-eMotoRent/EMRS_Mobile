export const ApiEndpoints = {
  baseUrl:
    "https://emrssep490-haevbjfhdkbzhaaj.southeastasia-01.azurewebsites.net/api",

  // Vehicle endpoints
  vehicle: {
    paginatedList: "/Vehicle",
    list: "/Vehicle/list",
    create: "/Vehicle/create",
    model: {
      create: "/Vehicle/model/create",
      list: "/Vehicle/model/list",
      search: "/Vehicle/model/search",
      detail: (id: string) => `/Vehicle/model/detail/${id}`,
    },
    pricing: {
      create: "/Vehicle/pricing/create",
    },
  },

  // Booking endpoints
  booking: {
    create: "/Booking/create",
    createVNPay: "/Booking/vnpay",
    vnpayIPN: "/Booking/vnpay/ipn",
    detail: (id: string) => `/Booking/${id}`,
    byRenter: (renterId: string) => `/Booking/renter/${renterId}`,
    byCurrentRenter: "/Booking/renter/get",
    list: "/Booking",
    assignVehicle: (vehicleId: string, bookingId: string) =>
      `/Booking/vehicle/assign/${bookingId}/${vehicleId}`,

    vnpayCallback: "/Booking/vnpay/callback",
  },

  // Auth endpoints
  auth: {
    register: "/auth/register",
    login: "/auth/login",
  },

  renter: {
    list: "/renters",
    update: "/account/renter",
    current: "/account/renter", // FIXED: NO ID for current (JWT-based)
    detail: (renterId: string) => `/account/renter/${renterId}`, // FIXED: WITH ID
    scanFace: "/account/renter/scan",
    document: {
      upload: "/api/Document", // POST
      update: (documentId: string) => `/api/Document/${documentId}`, // PUT
      delete: (documentId: string) => `/api/Document/${documentId}`, // DELETE
    },
  },

  //Document Endpoints
  document: {
    createCitizen: "/Document/citizen",
    createDriving: "/Document/driving",
    updateCitizen: "/Document/citizen",
    updateDriving: "/Document/driving",
    delete: (documentId: string) => `/Document/${documentId}`,
  },
  
  // Wallet endpoints
  wallet: {
    create: "/Wallet/model/create",
    myBalance: "/Wallet/my-balance",
  },

  // Receipt endpoints
  receipt: {
    create: "/rental/receipt",
    getDetails: (bookingId: string) => `/rental/receipt/${bookingId}`,
    generateContract: (bookingId: string, receiptId: string) =>
      `/rental/contract/${bookingId}/${receiptId}`,
    getContract: (bookingId: string) => `/rental/contract/${bookingId}`,
    generateOtp: (contractId: string) =>
      `/rental/contract/${contractId}/send-otp-code`,
    signContract: (contractId: string, receiptId: string, otpCode: string) =>
      `/rental/contract/${contractId}/${receiptId}/${otpCode}/confirm`,
    updateRentalReceipt: "/rental/receipt",
  },

  // Branch endpoints
  branch: {
    list: "/Branch",
    detail: (id: string) => `/Branch/${id}`,
    byVehicleModel: (vehicleModelId: string) => `/Branch/${vehicleModelId}`,
    create: "/Branch/create",
    update: (id: string) => `/Branch/${id}`,
    delete: (id: string) => `/Branch/${id}`,

    // NEW: Charging station search endpoint
    searchCharging: (lat: number, lon: number, radius: number) =>
      `/Branch/charging/search/${lat}/${lon}/${radius}`,
    getByLocation: (latitude: number, longitude: number, radius: number) =>
      `/Branch/charging/search/${latitude}/${longitude}/${radius}`,
  },

  // Insurance Claim endpoints
  insuranceClaim: {
    create: "/InsuranceClaim/create",
    myClaims: "/InsuranceClaim/my-claims",
    detail: (id: string) => `/InsuranceClaim/${id}`,
  },

  // Rental return endpoints
  rentalReturn: {
    analyzeReturn: "/rental-return/return/upload-and-analyze",
    createReceipt: "/rental-return/return/create-receipt",
    summary: (bookingId: string) =>
      `/rental-return/return/${bookingId}/summary`,
    finalizeReturn: `/rental-return/return/finalize`,
  },

  // Insurance Package endpoints
  insurancePackage: {
    getAll: "/InsurancePackage",
    detail: (id: string) => `/InsurancePackage/${id}`,
  },

  // Charging Station endpoints
  charging: {
    getByLicensePlate: "/Charging/search-by-license-plate",
    getChargingRate: "/Charging/get-charging-rate",
    create: "/Charging/create",
  },
};
