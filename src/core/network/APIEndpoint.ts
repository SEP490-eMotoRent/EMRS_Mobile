export const ApiEndpoints = {
  baseUrl:
    "https://emrssep490-haevbjfhdkbzhaaj.southeastasia-01.azurewebsites.net/api",

  // Vehicle endpoints
  vehicle: {
    paginatedList: "/Vehicle",
    list: "/Vehicle/list",
    detail: (id: string) => `/Vehicle/${id}`,
    create: "/Vehicle/create",
    model: {
      create: "/Vehicle/model/create",
      list: "/Vehicle/model/list",
      search: "/Vehicle/model/search",
      searchPagination: "/Vehicle/model/search/pagination",
      detail: (id: string) => `/Vehicle/model/detail/${id}`,
    },
    pricing: {
      create: "/Vehicle/pricing/create",
    },
    tracking: (vehicleId: string) => `/Vehicle/tracking/${vehicleId}`,
  },

  ticket: {
    create: "/Ticket/create",
    byBookingId: (bookingId: string) => `/Ticket/booking/${bookingId}`,
    detail: (ticketId: string) => `/Ticket/${ticketId}`,
    byStaffId: (staffId: string) => `/Ticket/staff/${staffId}`,
    update: `/Ticket`,
  },

  configuration: {
    getAll: "/Configuration",
    getById: (id: string) => `/Configuration/${id}`,
    getByType: (type: number) => `/Configuration/type/${type}`,
  },

  // Withdrawal Request endpoints
  withdrawalRequest: {
    create: "/WithdrawalRequest/create",
    myRequests: "/WithdrawalRequest/my-requests",
    detail: (id: string) => `/WithdrawalRequest/${id}`,
    cancel: (id: string) => `/WithdrawalRequest/${id}/cancel`,
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
    cancel: (bookingId: string) => `/Booking/cancel/${bookingId}`,
    vnpayCallback: "/Booking/vnpay/callback",
  },

  // Auth endpoints
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    googleLogin: "/auth/google-login",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    changePassword: "/auth/change-password",
  },

  transaction: {
    byRenterId: (renterId: string) => `/Transaction/renter/${renterId}`,
  },

  feedback: {
    create: "/Feedback/create",
    byBookingId: (bookingId: string) => `/Feedback/booking/${bookingId}`,
    byVehicleModelId: (vehicleModelId: string) => `/Feedback/vehicle/model/${vehicleModelId}`,
    getAll: "/Feedback/all",
  },

  renter: {
    list: "/renters",
    update: "/account/renter",
    current: "/account/renter",
    detail: (renterId: string) => `/account/renter/${renterId}`,
    scanFace: "/account/renter/scan",
    getByCitizenId: (citizenId: string) => `/account/renter/search/citizen?citizenId=${citizenId}`,
    document: {
      upload: "/api/Document",
      update: (documentId: string) => `/api/Document/${documentId}`,
      delete: (documentId: string) => `/api/Document/${documentId}`,
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
    topUp: "/Wallet/topup",
    vnPayCallback: "/Wallet/vnpay/callback",
  },

  // Receipt endpoints
  receipt: {
    changeVehicle: "/rental/receipt/change/vehicle",
    create: "/rental/receipt",
    getListRentalReceipt: (bookingId: string) => `/rental/receipt/${bookingId}`,
    getDetailRentalReceipt: (rentalReceiptId: string) =>
      `/rental/receipt/by/${rentalReceiptId}`,
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

  // Holiday Pricing endpoints
  holidayPricing: {
    getAll: "/HolidayPricing",
    getById: (id: string) => `/HolidayPricing/${id}`,
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
    getByBookingId: (bookingId: string) => `/Charging/booking/${bookingId}`,
  },

  //GPS Sharing endpoints
  gpsSharing: {
    invite: "/GPSSharing/invite",
    join: "/GPSSharing/join",
    getSession: (sessionId: string) => `/GPSSharing/session/${sessionId}`,
    getSessions: "/GPSSharing/sessions",
    getSessionsByRenterId: (renterId: string) => `/GPSSharing/sessions/renter/${renterId}`,
  },

  // Additional Fees endpoints
  additionalFees: {
    addLateReturnFee: "/additional-fees/late-return",
    addCrossBranchFee: "/additional-fees/cross-branch",
    addExcessKmFee: "/additional-fees/excess-km",
    addDamageFee: "/additional-fees/damage",
    addCleaningFee: "/additional-fees/cleaning",
    getDamageTypes: "/additional-fees/damage-types",
  },
};
