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
      detail: (id: string) => `/Vehicle/model/detail/${id}`,
    },
    pricing: {
      create: "/Vehicle/pricing/create",
    },
  },

  // Booking endpoints
  booking: {
    create: "/Booking/create",
    detail: (id: string) => `/Booking/${id}`,
    byRenter: (renterId: string) => `/Booking/renter/${renterId}`,
    byCurrentRenter: "/Booking/renter/get",
    list: "/Booking",
    assignVehicle: (vehicleId: string, bookingId: string) =>
      `/Booking/vehicle/assign/${bookingId}/${vehicleId}`,
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
    }
  },

  //Document Endpoints
  document: {
    createCitizen: "/Document/citizen",
    createDriving: "/Document/driving",
    updateCitizen: "/Document/citizen",
    updateDriving: "/Document/driving",
    delete: (documentId: string) => `/Document/${documentId}`,
  },
  
  // Receipt endpoints
  receipt: {
    create: "/rental/receipt",
    generateContract: (bookingId: string) => `/rental/contract/${bookingId}`,
    getContract: (bookingId: string) => `/rental/contract/${bookingId}`,
    generateOtp: (contractId: string) =>
      `/rental/contract/${contractId}/send-otp-code`,
    signContract: (contractId: string, otpCode: string) =>
      `/rental/contract/${contractId}/${otpCode}/confirm`,
    updateRentalReceipt: "/rental/receipt",
  },

  // Branch endpoints
  branch: {
    list: "/Branch",
    detail: (id: string) => `/Branch/${id}`,
    create: "/Branch/create",
    update: (id: string) => `/Branch/${id}`,
    delete: (id: string) => `/Branch/${id}`,
  },

  // Insurance Claim endpoints
  insuranceClaim: {
    create: "/InsuranceClaim/create",
    myClaims: "/InsuranceClaim/my-claims",
    detail: (id: string) => `/InsuranceClaim/${id}`,
  },
};