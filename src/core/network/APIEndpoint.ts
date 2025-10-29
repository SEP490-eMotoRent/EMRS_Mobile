export const ApiEndpoints = {
    baseUrl: "https://emrssep490-haevbjfhdkbzhaaj.southeastasia-01.azurewebsites.net/api",
    
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
            create: "/Vehicle/pricing/create"
        },
    },
    
    // Booking endpoints
    booking: {
        create: "/Booking/create",
        detail: (id: string) => `/Booking/${id}`,
        byRenter: (renterId: string) => `/Booking/renter/${renterId}`,
        byCurrentRenter: "/Booking/renter/get",
        list: "/Booking",
        assignVehicle: (vehicleId: string, bookingId: string) => `/Booking/vehicle/assign/${bookingId}/${vehicleId}`,
    },
    // Auth endpoints
    auth: {
        register: "/auth/register",
        login: "/auth/login",
    },

    // Renter endpoints
    renter: {
        list: "/renters",
        update: "/account/renter",
    },

    // Receipt endpoints
    receipt: {
        create: "/rental/receipt",
        generateContract: (bookingId: string) => `/rental/contract/${bookingId}`,
    },
};