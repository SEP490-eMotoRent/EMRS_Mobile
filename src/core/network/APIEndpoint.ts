export const ApiEndpoints = {
    baseUrl: "https://emrssep490-haevbjfhdkbzhaaj.southeastasia-01.azurewebsites.net/api",
    
    // Vehicle endpoints
    vehicle: {
        list: "/Vehicle/list",
        create: "/Vehicle/create",
        model: {
            create: "/Vehicle/model/create",
            list: "/Vehicle/model/list",
            detail: (id: string) => `/Vehicle/model/detail/${id}`,
        },
        pricing: {
            create: "/Vehicle/pricing/create"
        }
    },
    
    // Booking endpoints
    booking: {
        create: "/Booking/create",
        detail: (id: string) => `/Booking/${id}`,
        byRenter: (renterId: string) => `/Booking/renter/${renterId}`,
        byCurrentRenter: "/Booking/renter/get", // ✅ NEW - uses token
    },
    
    // Auth endpoints
    auth: {
        register: "/auth/register",
        login: "/auth/login",
    },

    renters: "/renters",
};