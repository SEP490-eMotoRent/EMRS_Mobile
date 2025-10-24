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
    
    // Auth endpoints
    auth: {
        register: "/auth/register",
        login: "/auth/login",
    },

    renters: "/renters",
};